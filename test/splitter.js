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

            assert.equal(alice, aliceAddress, "Alice address was not stored correctly");

            assert.equal(bob[0], bobAddress, "Bob address was not stored correctly");
            assert.equal(bob[1], 0, "Bob balance was not initialized correctly");

            assert.equal(carol[0], carolAddress, "Carol address was not stored correctly");
            assert.equal(carol[1], 0, "Carol balance was not initialized correctly");
        });

        it('should not create a contract', async () => {
            let errorFlag = -1;

            const inputAddress = "0x0000000000000000000000000000000000000001";
            const invalidAddress = "0x0000000000000000000000000000000000000000";

            try {
                await Splitter.new(inputAddress, invalidAddress);
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1, "Zero address should not be accepted");

            try {
                await Splitter.new(accounts[0], accounts[0]);
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1, "Alice is not Bob or Carol");

            try {
                await Splitter.new(inputAddress, accounts[0]);
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1, "Alice is not Carol");

            try {
                await Splitter.new(accounts[0], inputAddress);
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1, "Alice is not Bob");

            try {
                await Splitter.new(inputAddress, inputAddress);
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1, "Bob and Carol cannot share the same address");
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
            let errorFlag = -1;

            try {
                await splitterInstance.split({from: accounts[0], gas: 100000, gasPrice: 2});
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1);
        });

        it('should split correctly the whole transaction value', async () => {
            const transactionValue = 10;

            await splitterInstance.split({from: accounts[0], value: transactionValue});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, transactionValue, "Contract balance is not correct");
            assert.equal(bob[1], 5, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 5, "Carol balance was not calculated correctly");
        });

        it('should split correctly and leave one wei unsplitted', async () => {
            const transactionValue = 11;

            await splitterInstance.split({from: accounts[0], value: transactionValue});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, transactionValue, "Contract balance is not correct");
            assert.equal(bob[1], 5, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 5, "Carol balance was not calculated correctly");
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

            assert.equal(contractBalance, expectedContractBalance, "Contract balance is not correct");
            assert.equal(bob[1], expectedBobBalance, "Bob balance was not calculated correctly");
            assert.equal(carol[1], expectedCarolBalance, "Carol balance was not calculated correctly");
        });

        it('should not allow to pull from non-Bob, non-Alice accounts', async () => {
            let errorFlag = -1;
            const nonBobAliceAddress = "0x0000000000000000000000000000000000000001";

            try {
                await splitterInstance.pull({from: nonBobAliceAddress});
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1);
        });

        it('should not allow Bob to pull with 0 balance', async () => {
            let errorFlag = -1;

            try {
                await splitterInstance.pull({from: acconts[1]});
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1);
        });

        it('should not allow Carol to pull with 0 balance', async () => {
            let errorFlag = -1;

            try {
                await splitterInstance.pull({from: acconts[2]});
                errorFlag = 0;
            } catch (err) {
                errorFlag = 1;
            }

            assert(errorFlag == 1);
        })

        it('should clear Bob & Carol balances after pull', async () => {
            await splitterInstance.split({from: accounts[0], value: 10});
            await splitterInstance.pull({from: bobAddress});
            await splitterInstance.pull({from: aliceAddress});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, 0, "Contract balance is not correct");
            assert.equal(bob[1], 0, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 0, "Carol balance was not calculated correctly");
        })

        it('should clear Bob & Carol balances after pull and leave 1 wei in contract', async () => {
            await splitterInstance.split({from: accounts[0], value: 11});
            await splitterInstance.pull({from: bobAddress});
            await splitterInstance.pull({from: aliceAddress});

            const bob = await splitterInstance.bob.call();
            const carol = await splitterInstance.carol.call();
            const contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, 1, "Contract balance is not correct");
            assert.equal(bob[1], 0, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 0, "Carol balance was not calculated correctly");
        })

        it('should clear Bob & Carol balances after series of splits and pulls', async () => {
            await splitterInstance.split({from: accounts[0], value: 10});
            await splitterInstance.pull({from: bobAddress});

            let bob = await splitterInstance.bob.call();
            let carol = await splitterInstance.carol.call();
            let contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, 5, "Contract balance is not correct");
            assert.equal(bob[1], 0, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 5, "Carol balance was not calculated correctly");

            await splitterInstance.split({from: accounts[0], value: 10});

            bob = await splitterInstance.bob.call();
            carol = await splitterInstance.carol.call();
            contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, 15, "Contract balance is not correct");
            assert.equal(bob[1], 5, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 10, "Carol balance was not calculated correctly");

            await splitterInstance.pull({from: aliceAddress});

            bob = await splitterInstance.bob.call();
            carol = await splitterInstance.carol.call();
            contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, 5, "Contract balance is not correct");
            assert.equal(bob[1], 5, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 0, "Carol balance was not calculated correctly");

            await splitterInstance.pull({from: bobAddress});

            bob = await splitterInstance.bob.call();
            carol = await splitterInstance.carol.call();
            contractBalance = await web3.eth.getBalance(splitterInstance.address);

            assert.equal(contractBalance, 0, "Contract balance is not correct");
            assert.equal(bob[1], 0, "Bob balance was not calculated correctly");
            assert.equal(carol[1], 0, "Carol balance was not calculated correctly");
        })

    });

});