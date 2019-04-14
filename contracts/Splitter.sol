pragma solidity 0.5.0;

contract Splitter {
    event LogSplit(address indexed _alice, address indexed _bob, address indexed _carol, uint _value);
    event LogPull(address indexed _to, uint _value);

    struct Receiver {
        address payable addr;
        uint balance;
    }

    address public alice;
    Receiver public bob;
    Receiver public carol;

    modifier onlyAlice {
        require(msg.sender == alice);
        _;
    }

    constructor(address payable _bob, address payable _carol) public {
        require(_bob != address(0));
        require(_carol != address(0));
        require(msg.sender != _bob);
        require(msg.sender != _carol);
        require(_bob != _carol);

        alice = msg.sender;

        bob.addr = _bob;
        carol.addr = _carol;
    }

    function split() public payable onlyAlice returns (bool success) {
        require(msg.value > 0);

        uint halvedValue = (msg.value >> 1);

        require(bob.balance + halvedValue > bob.balance);
        require(carol.balance + halvedValue > carol.balance);

        bob.balance += halvedValue;
        carol.balance += halvedValue;

        emit LogSplit(alice, bob.addr, carol.addr, halvedValue);

        return true;
    }

    function pull() public payable returns (bool success) {
        require(((msg.sender == bob.addr) ||
                 (msg.sender == carol.addr)));

        if (msg.sender == bob.addr) {
            require(bob.balance > 0);
            require(address(this).balance >= bob.balance);

            address payable bobAddr = bob.addr;
            uint bobBalance = bob.balance;

            bobAddr.transfer(bobBalance);
            bob.balance = 0;

            emit LogPull(bob.addr, bobBalance);
        }

        if (msg.sender == carol.addr) {
            require(carol.balance > 0);
            require(address(this).balance >= carol.balance);

            address payable carolAddr = carol.addr;
            uint carolBalance = carol.balance;

            carolAddr.transfer(carol.balance);
            carol.balance = 0;

            emit LogPull(carol.addr, carolBalance);
        }

        return true;
    }
}