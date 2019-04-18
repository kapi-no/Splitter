const splitterABI = `
[
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x27e235e3"
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
        "name": "_bobValue",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_carolValue",
        "type": "uint256"
      }
    ],
    "name": "LogSplit",
    "type": "event",
    "signature": "0xdf977ab3eb0f0f54e3e1537715c34722a263893bebe7df51f229a8829f9c1521"
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
    "inputs": [
      {
        "name": "bob",
        "type": "address"
      },
      {
        "name": "carol",
        "type": "address"
      }
    ],
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
    "signature": "0x0f2c9329"
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
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x329eb839"
  }
]`;