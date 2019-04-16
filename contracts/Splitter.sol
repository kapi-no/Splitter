pragma solidity 0.5.0;

import "./SafeMath.sol";

contract Splitter {
    event LogSplit(address indexed _alice, address indexed _bob, address indexed _carol,
                   uint _bobValue, uint _carolValue);
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

        uint bobValue = (msg.value >> 1);
        uint carolValue = bobValue;

        if ((msg.value % 2) == 1) {
            bobValue += 1;
        }

        bob.balance = SafeMath.add(bob.balance, bobValue);
        carol.balance = SafeMath.add(carol.balance, carolValue);

        emit LogSplit(alice, bob.addr, carol.addr, bobValue, carolValue);

        return true;
    }

    function pull() public returns (bool success) {
        if (msg.sender == bob.addr) {
            require(bob.balance > 0);
            require(address(this).balance >= bob.balance);

            address payable bobAddr = bob.addr;
            uint bobBalance = bob.balance;

            emit LogPull(bobAddr, bobBalance);

            bob.balance = 0;
            bobAddr.transfer(bobBalance);
        } else if (msg.sender == carol.addr) {
            require(carol.balance > 0);
            assert(address(this).balance >= carol.balance);

            address payable carolAddr = carol.addr;
            uint carolBalance = carol.balance;

            emit LogPull(carolAddr, carolBalance);

            carol.balance = 0;
            carolAddr.transfer(carolBalance);
        } else {
            revert();
        }

        return true;
    }
}