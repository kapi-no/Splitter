if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
}

function updateStaticElement(name, value) {
    if (document.getElementById(name) !== null) {
        document.getElementById(name).innerHTML = value;
    }
}

function getBalance(account) {
    web3.eth.getBalance(account.address.val, function (err, bal) {
        if (!err) {
            account.balance.val = bal;
            updateStaticElement(account.balance.key, account.balance.val);
        } else {
            console.log(err)
        }
    });
}

function refreshBalance(account) {
    updateStaticElement(account.address.key, account.address.val);
    getBalance(account);
}

function refreshAllBalances(accounts) {
    for (const acc of accounts) {
        refreshBalance(acc);
    }
}

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

function getSplitValue() {
    let splitValueStr = document.getElementById("splitValue").value;
    if (isInt(splitValueStr)) {
        return parseInt(splitValueStr, 10);
    } else {
        return -1;
    }
}

function split() {
    let splitValue = getSplitValue();
    if (splitValue < 0) {
        alert("Bad input");
        return;
    }

    splitterInstance.split(
        {from: alice.address.val, value: splitValue, gas: 100000, gasPrice:2},
        function (err, txObj){
            if (!err) {
                console.log("Transcation hash: " + txObj);
            } else {
                console.log(err);
            }
        });
}

function pullBobFunds() {
    splitterInstance.pull(
        {from: bob.address.val, value: 0, gas: 100000, gasPrice:2},
        function (err, txObj){
            if (!err) {
                console.log("Transcation hash: " + txObj);
            } else {
                console.log(err);
            }
        });
}

function pullCarolFunds() {
    splitterInstance.pull(
        {from: carol.address.val, value: 0, gas: 100000, gasPrice:2},
        function (err, txObj){
            if (!err) {
                console.log("Transcation hash: " + txObj);
            } else {
                console.log(err);
            }
        });
}

function refresh() {
    refreshAllBalances([alice, bob, carol, splitter]);
}


let alice = {address: {key: "aliceAddress", val: "0x"}, balance: {key: "aliceBalance", val: 0}};
let bob = {address: {key: "bobAddress", val: "0x"}, balance: {key: "bobBalance", val: 0}};
let carol = {address: {key: "carolAddress", val: "0x"}, balance: {key: "carolBalance", val: 0}};

const splitterAddress = "0x3e91b633b3937664fca22Cc38d10E4B17aA82B4E";
const splitterInstance = web3.eth.contract(JSON.parse(splitterABI)).at(splitterAddress);
let splitter = {address: {key: "splitterAddress", val: splitterAddress}, 
                balance: {key: "splitterBalance", val: 0}};


splitterInstance.alice.call(function (err, aliceAccount) {
    if (!err) {
        alice.address.val = aliceAccount;

        refreshBalance(alice);
    } else {
        console.log(err);
    }
});

splitterInstance.bob.call(function (err, bobAccount) {
    if (!err) {
        bob.address.val = bobAccount[0];

        refreshBalance(bob);
    } else {
        console.log(err);
    }
});

splitterInstance.carol.call(function (err, carolAccount) {
    if (!err) {
        carol.address.val = carolAccount[0];

        refreshBalance(carol);
    } else {
        console.log(err);
    }
});

window.onload = function() {
    refreshBalance(splitter);
}
