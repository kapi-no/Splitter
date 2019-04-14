const splitterABI = `
[
  {
    "constant": true,
    "inputs": [],
    "name": "carol",
    "outputs": [
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8b930f15"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "bob",
    "outputs": [
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc09cec77"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "alice",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xfb47e3a2"
  },
  {
    "inputs": [
      {
        "name": "_bob",
        "type": "address"
      },
      {
        "name": "_carol",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_alice",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_bob",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_carol",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "LogSplit",
    "type": "event",
    "signature": "0x5861cc23de8cab7630160dc0ee2c1e9aa2a0f1498f73c387807c0100e6684da7"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "LogPull",
    "type": "event",
    "signature": "0xfb8348e13f1e8d32f1658b22e0de4810e893e9a24105836e6594c934dc825a58"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "split",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0xf7654176"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "pull",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x329eb839"
  }
]`;