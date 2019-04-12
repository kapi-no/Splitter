const splitterABI = `
[
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
          "name": "_from",
          "type": "address"
        },
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
      "name": "LogSplit",
      "type": "event",
      "signature": "0xccdce1ba8a318337c8272dcad903b86cf313f00b37bbb051b59b2f35a81c7c6a"
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
    }
]`;