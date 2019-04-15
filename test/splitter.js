const truffleAssert = require('truffle-assertions');

const Splitter = artifacts.require("Splitter");

contract('Splitter', (accounts) => {

    describe("constructor initialization tests", function() {

        it('should store Alice, Bob & Carol init data', async () => {
            const aliceAddress = accounts[0];
            const bobAddress = "0x0000000000000000000000000000000000000001";
            const carolAddress = "0x0000000000000000000000000000000000000002";

            const splitterInstance = await Splitter.new(bobAddress, carolAddress);

            const alice = await splitterInstance.alice.call();
            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();

            assert.strictEqual(alice, aliceAddress, "Alice address was not stored correctly");

            assert.strictEqual(bob[0], bobAddress, "Bob address was not stored correctly");
            assert.strictEqual(bob[1].toString(), "0", "Bob balance was not initialized correctly");

            assert.strictEqual(carol[0], carolAddress, "Carol address was not stored correctly");
            assert.strictEqual(carol[1].toString(), "0", "Carol balance was not initialized correctly");
        });

        it('should not create a contract', async () => {
            const inputAddress = "0x0000000000000000000000000000000000000001";
            const invalidAddress = "0x0000000000000000000000000000000000000000";

            await truffleAssert.fails(Splitter.new(inputAddress, invalidAddress));
            await truffleAssert.fails(Splitter.new(accounts[0], accounts[0]));
            await truffleAssert.fails(Splitter.new(inputAddress, accounts[0]));
            await truffleAssert.fails(Splitter.new(accounts[0], inputAddress));
            await truffleAssert.fails(Splitter.new(inputAddress, inputAddress));
        });
    });

    describe("non-constructor tests", function() {

        let bobAddress;
        let aliceAddress;

        let splitterInstance;

        beforeEach('setup contract for each test', async function () {
            bobAddress = accounts[1];
            aliceAddress = accounts[2];

            splitterInstance = await Splitter.new(bobAddress, aliceAddress);
        });

        it('should throw an error when splitting zero value', async () => {
            await truffleAssert.fails(splitterInstance.split({from: accounts[0], gas: 100000}));
        });

        it('should split correctly even value', async () => {
            const transactionValue = 10;

            await splitterInstance.split({from: accounts[0], value: transactionValue});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), transactionValue.toString(),
                               "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "5", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "5", "Carol balance was not calculated correctly");
        });

        it('should split correctly uneven value', async () => {
            const transactionValue = 11;

            await splitterInstance.split({from: accounts[0], value: transactionValue});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), transactionValue.toString(),
                               "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "6", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "5", "Carol balance was not calculated correctly");
        });

        it('should split multiple times correctly', async () => {
            const transactionValues = [1000, 500, 400, 200];

            let expectedBobBalance = 0;
            let expectedCarolBalance = 0;
            let expectedContractBalance = 0;

            let transactionPromises = [];
            for (const transactionValue of transactionValues) {
                transactionPromises.push(splitterInstance.split(
                    {from: accounts[0], value: transactionValue}));

                expectedBobBalance += transactionValue / 2;
                expectedCarolBalance += transactionValue / 2;
                expectedContractBalance += transactionValue;
            }

            for (const transactionPromise of transactionPromises) {
                await transactionPromise;
            }

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), expectedContractBalance.toString(),
                               "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), expectedBobBalance.toString(),
                               "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), expectedCarolBalance.toString(),
                               "Carol balance was not calculated correctly");
        });

        it('should not allow to pull from non-Bob, non-Alice accounts', async () => {
            const nonBobAliceAddress = "0x0000000000000000000000000000000000000001";

            await truffleAssert.fails(splitterInstance.pull({from: nonBobAliceAddress, gas: 100000}));
        });

        it('should not allow Bob to pull with 0 balance', async () => {
            await truffleAssert.fails(splitterInstance.pull({from: bobAddress, gas: 100000}));
        });

        it('should not allow Carol to pull with 0 balance', async () => {
            await truffleAssert.fails(splitterInstance.pull({from: aliceAddress, gas: 100000}));
        })

        it('should clear Bob & Carol balances after pull with even split', async () => {
            await splitterInstance.split({from: accounts[0], value: 10});
            await splitterInstance.pull({from: bobAddress});
            await splitterInstance.pull({from: aliceAddress});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), "0", "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "0", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "0", "Carol balance was not calculated correctly");
        })

        it('should clear Bob & Carol balances after pull with uneven split', async () => {
            await splitterInstance.split({from: accounts[0], value: 11});
            await splitterInstance.pull({from: bobAddress});
            await splitterInstance.pull({from: aliceAddress});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), "0", "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "0", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "0", "Carol balance was not calculated correctly");
        })

        it('should clear Bob & Carol balances after series of splits and pulls', async () => {
            await splitterInstance.split({from: accounts[0], value: 10});
            await splitterInstance.pull({from: bobAddress});

            let bob = await splitterInstance.bob.call();
            let carol = await splitterInstance.carol.call();
            let contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), "5", "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "0", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "5", "Carol balance was not calculated correctly");

            await splitterInstance.split({from: accounts[0], value: 10});

            bob = await splitterInstance.bob.call();
            carol = await splitterInstance.carol.call();
            contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), "15", "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "5", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "10", "Carol balance was not calculated correctly");

            await splitterInstance.pull({from: aliceAddress});

            bob = await splitterInstance.bob.call();
            carol = await splitterInstance.carol.call();
            contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), "5", "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "5", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "0", "Carol balance was not calculated correctly");

            await splitterInstance.pull({from: bobAddress});

            bob = await splitterInstance.bob.call();
            carol = await splitterInstance.carol.call();
            contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.strictEqual(contractBalance.toString(), "0", "Contract balance is not correct");
            assert.strictEqual(bob[1].toString(), "0", "Bob balance was not calculated correctly");
            assert.strictEqual(carol[1].toString(), "0", "Carol balance was not calculated correctly");
        })

    });

});