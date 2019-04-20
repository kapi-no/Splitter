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
    "constant": false,
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x3f4ba83a"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isPauser",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x46fbf68e"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x5c975abb"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renouncePauser",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x6ef8d66d"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addPauser",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x82dc1ec4"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x8456cb59"
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event",
    "signature": "0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event",
    "signature": "0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "PauserAdded",
    "type": "event",
    "signature": "0x6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f8"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "PauserRemoved",
    "type": "event",
    "signature": "0xcd265ebaf09df2871cc7bd4133404a235ba12eff2041bb89d9c714a2621c7c7e"
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