const Web3 = require("web3");
const truffleContract = require("truffle-contract");
const $ = require("jquery");

const splitterJson = require("../../build/contracts/Splitter.json");

if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

const Splitter = truffleContract(splitterJson);
Splitter.setProvider(window.web3.currentProvider);

let alice = {address: {key: "#aliceAddress", val: "0x"}, balance: {key: "#aliceBalance", val: 0}};
let bob = {address: {key: "#bobAddress", val: "0x"}, balance: {key: "#bobBalance", val: 0}};
let carol = {address: {key: "#carolAddress", val: "0x"}, balance: {key: "#carolBalance", val: 0}};
let splitter = {address: {key: "#splitterAddress", val: "0x"}, balance: {key: "#splitterBalance", val: 0}};

window.addEventListener('load', function() {
    return web3.eth.getAccounts()
        .then(accounts => {
            if (accounts.length < 3) {

                for (const acc of [alice, bob, carol, splitter]) {
                    $(acc.address.key).html("N/A");
                    $(acc.balance.key).html("N/A");
                }

                throw new Error("No required accounts present");
            }
            alice.address.val = accounts[0];
            bob.address.val = accounts[1];
            carol.address.val = accounts[2];

            return Splitter.deployed();
        })
        .then(deployed => {
            splitter.address.val = deployed.address;
            refreshAllBalances([alice, bob, carol, splitter]);

            $("#split").click(split);
            $("#pullBob").click(pullBob);
            $("#pullCarol").click(pullCarol);
            $("#refresh").click(refresh);
        })
        .catch(e => {
            $("#status").html(e.toString());
            console.error(e);
        });
});

function refreshAllBalances(accounts) {
    $("#status").html("Refreshing balances...");

    let accCounter = 0;
    const accNumber = accounts.length;

    function refreshBalance(account) {
        function getBalance(account) {
            return web3.eth.getBalance(account.address.val)
            .then(bal => {
                account.balance.val = bal;
                $(account.balance.key).html(account.balance.val);

                accCounter += 1;
                if (accCounter == accNumber) {
                    $("#status").html("Balances refreshed");
                }
            })
            .catch(e => {
                $("#status").html(e.toString());
                console.error(e);
            });
        }

        $(account.address.key).html(account.address.val);
        getBalance(account);
    };

    for (const acc of accounts) {
        refreshBalance(acc);
    }
}

function checkReceiptStatus(receipt) {
    console.log("Got receipt", receipt);
    if (!receipt.status) {
        console.error("Wrong status");
        console.error(receipt);
        $("#status").html("There was an error in the tx execution, status not 1");
    } else if (receipt.logs.length == 0) {
        console.error("Empty logs");
        console.error(receipt);
        $("#status").html("There was an error in the tx execution, missing expected event");
    } else {
        console.log(receipt.logs[0]);
        $("#status").html("Transfer executed");
    }
}

const split = function() {
    let deployed;
    const gas = 300000;
    const splitValue = $("input[name='splitValue']").val();

    return Splitter.deployed()
        .then(_deployed => {
            deployed = _deployed;

            return deployed.split.call(bob.address.val, carol.address.val,
                { from: alice.address.val, value: splitValue, gas: gas });
        })
        .then(success => {
            if (!success) {
                throw new Error("The transaction will fail anyway, not sending");
            }

            return deployed.split(bob.address.val, carol.address.val,
                { from: alice.address.val, value: splitValue, gas: gas })
                .on(
                    "transactionHash",
                    txHash => $("#status").html("Transaction on the way " + txHash)
                );
        })
        .then(txObj => {
            checkReceiptStatus(txObj.receipt);

            refreshAllBalances([alice, bob, carol, splitter]);
        })
        .catch(e => {
            $("#status").html(e.toString());
            console.error(e);
        });
};

function pull(account) {
    let deployed;
    const gas = 300000;

    return Splitter.deployed()
        .then(_deployed => {
            deployed = _deployed;

            return deployed.pull.call({from: account, gas: gas });
        })
        .then(success => {
            if (!success) {
                throw new Error("The transaction will fail anyway, not sending");
            }

            return deployed.pull({from: account, gas: gas })
                .on(
                    "transactionHash",
                    txHash => $("#status").html("Transaction on the way " + txHash)
                );
        })
        .then(txObj => {
            checkReceiptStatus(txObj.receipt);

            refreshAllBalances([alice, bob, carol, splitter]);
        })
        .catch(e => {
            $("#status").html(e.toString());
            console.error(e);
        });
};

const pullBob = function() {
    pull(bob.address.val);
};

const pullCarol = function() {
    pull(carol.address.val);
};

const refresh = function() {
    refreshAllBalances([alice, bob, carol, splitter]);
};

require("file-loader?name=../index.html!../index.html");