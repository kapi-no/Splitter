const truffleAssert = require('truffle-assertions');

const Splitter = artifacts.require("Splitter");

const BN = web3.utils.BN;

contract('Splitter', (accounts) => {

    let bobAddress;
    let carolAddress;

    let splitterInstance;

    beforeEach('setup contract for each test', async function () {
        bobAddress = accounts[1];
        carolAddress = accounts[2];

        splitterInstance = await Splitter.new({from: accounts[0]});
    });

    it('should fail when triggering fallback function', async () => {
        await truffleAssert.fails(web3.eth.sendTransaction(
            {from: accounts[0], to: splitterInstance.address, gas: 100000, value: 1000}));
    });

    it('should throw an error when splitting zero value', async () => {
        await truffleAssert.fails(splitterInstance.split(
            bobAddress, carolAddress, {from: accounts[0], gas: 100000}));
    });

    it('should throw errors during input address validation', async () => {
        const inputAddress = accounts[1];
        const invalidAddress = "0x0000000000000000000000000000000000000000";

        await truffleAssert.fails(splitterInstance.split(
            inputAddress, invalidAddress, {from: accounts[0], gas: 100000}));
        await truffleAssert.fails(splitterInstance.split(
            accounts[0], accounts[0], {from: accounts[0], gas: 100000}));
        await truffleAssert.fails(splitterInstance.split(
            inputAddress, accounts[0], {from: accounts[0], gas: 100000}));
        await truffleAssert.fails(splitterInstance.split(
            accounts[0], inputAddress, {from: accounts[0], gas: 100000}));
        await truffleAssert.fails(splitterInstance.split(
            inputAddress, inputAddress, {from: accounts[0], gas: 100000}));
    });

    it('should split correctly even value', async () => {
        const transactionValue = 10;

        await splitterInstance.split(bobAddress, carolAddress,
            {from: accounts[0], value: transactionValue});

        const contractBalance = await web3.eth.getBalance(splitterInstance.address);
        const bobBalance = await splitterInstance.balances.call(bobAddress);
        const carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), transactionValue.toString(),
                            "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "5", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "5", "Carol balance was not calculated correctly");
    });

    it('should split correctly uneven value', async () => {
        const transactionValue = 11;

        await splitterInstance.split(bobAddress, carolAddress,
            {from: accounts[0], value: transactionValue});

        const contractBalance = await web3.eth.getBalance(splitterInstance.address);
        const bobBalance = await splitterInstance.balances.call(bobAddress);
        const carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), transactionValue.toString(),
                            "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "6", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "5", "Carol balance was not calculated correctly");
    });

    it('should split multiple times correctly', async () => {
        const transactionValues = [1000, 500, 400, 200];

        let expectedBobBalance = 0;
        let expectedCarolBalance = 0;
        let expectedContractBalance = 0;

        let transactionPromises = [];
        for (const transactionValue of transactionValues) {
            transactionPromises.push(splitterInstance.split(
                bobAddress, carolAddress, {from: accounts[0], value: transactionValue}));

            expectedBobBalance += transactionValue / 2;
            expectedCarolBalance += transactionValue / 2;
            expectedContractBalance += transactionValue;
        }

        for (const transactionPromise of transactionPromises) {
            await transactionPromise;
        }

        const contractBalance = await web3.eth.getBalance(splitterInstance.address);
        const bobBalance = await splitterInstance.balances.call(bobAddress);
        const carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), expectedContractBalance.toString(),
                            "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), expectedBobBalance.toString(),
                            "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), expectedCarolBalance.toString(),
                            "Carol balance was not calculated correctly");
    });

    it('should not allow to pull with 0 balance', async () => {
        await truffleAssert.fails(splitterInstance.pull({from: bobAddress, gas: 100000}));
    });

    it('should clear Bob & Carol balances after pull with even split', async () => {
        await splitterInstance.split(bobAddress, carolAddress, {from: accounts[0], value: 10});
        await splitterInstance.pull({from: bobAddress});
        await splitterInstance.pull({from: carolAddress});

        const contractBalance = await web3.eth.getBalance(splitterInstance.address);
        const bobBalance = await splitterInstance.balances.call(bobAddress);
        const carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), "0", "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "0", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "0", "Carol balance was not calculated correctly");
    });

    it('should clear Bob & Carol balances after pull with uneven split', async () => {
        await splitterInstance.split(bobAddress, carolAddress, {from: accounts[0], value: 11});
        await splitterInstance.pull({from: bobAddress});
        await splitterInstance.pull({from: carolAddress});

        const contractBalance = await web3.eth.getBalance(splitterInstance.address);
        const bobBalance = await splitterInstance.balances.call(bobAddress);
        const carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), "0", "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "0", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "0", "Carol balance was not calculated correctly");
    });

    it('Bob & Carol should receive some Weis after pull with uneven split', async () => {
        const bobPreBalance = await web3.eth.getBalance(bobAddress);
        const carolPreBalance = await web3.eth.getBalance(carolAddress);

        const bobSplittedFunds = 7;
        const carolSplittedFunds = 6;
        const gasPrice = 2;

        await splitterInstance.split(bobAddress, carolAddress,
            {from: accounts[0], value: (bobSplittedFunds + carolSplittedFunds)});

        const bobTxObj = await splitterInstance.pull({from: bobAddress, gasPrice: gasPrice});
        const bobBalanceChange = new BN(bobSplittedFunds - bobTxObj.receipt.gasUsed * gasPrice);
        const expectedBobBalance = new BN(bobPreBalance).add(bobBalanceChange);
        const bobBalance = await web3.eth.getBalance(bobAddress);

        assert.strictEqual(bobTxObj.receipt.status, true, "Bob TX failed");
        assert.strictEqual(bobBalance, expectedBobBalance.toString(),
                            "Bob balance is not correct");

        const carolTxObj = await splitterInstance.pull({from: carolAddress, gasPrice: gasPrice});
        const carolBalanceChange = new BN(carolSplittedFunds - carolTxObj.receipt.gasUsed * gasPrice);
        const expectedcarolBalance = new BN(carolPreBalance).add(carolBalanceChange);
        const carolBalance = await web3.eth.getBalance(carolAddress);

        assert.strictEqual(carolTxObj.receipt.status, true, "Carol TX failed");
        assert.strictEqual(carolBalance, expectedcarolBalance.toString(),
                            "Carol balance is not correct");
    });

    it('should clear Bob & Carol balances after series of splits and pulls', async () => {
        await splitterInstance.split(bobAddress, carolAddress, {from: accounts[0], value: 10});
        await splitterInstance.pull({from: bobAddress});

        let contractBalance = await web3.eth.getBalance(splitterInstance.address);
        let bobBalance = await splitterInstance.balances.call(bobAddress);
        let carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), "5", "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "0", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "5", "Carol balance was not calculated correctly");

        await splitterInstance.split(bobAddress, carolAddress, {from: accounts[0], value: 10});

        contractBalance = await web3.eth.getBalance(splitterInstance.address);
        bobBalance = await splitterInstance.balances.call(bobAddress);
        carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), "15", "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "5", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "10", "Carol balance was not calculated correctly");

        await splitterInstance.pull({from: carolAddress});

        contractBalance = await web3.eth.getBalance(splitterInstance.address);
        bobBalance = await splitterInstance.balances.call(bobAddress);
        carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), "5", "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "5", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "0", "Carol balance was not calculated correctly");

        await splitterInstance.pull({from: bobAddress});

        contractBalance = await web3.eth.getBalance(splitterInstance.address);
        bobBalance = await splitterInstance.balances.call(bobAddress);
        carolBalance = await splitterInstance.balances.call(carolAddress);

        assert.strictEqual(contractBalance.toString(), "0", "Contract balance is not correct");
        assert.strictEqual(bobBalance.toString(), "0", "Bob balance was not calculated correctly");
        assert.strictEqual(carolBalance.toString(), "0", "Carol balance was not calculated correctly");
    });

});