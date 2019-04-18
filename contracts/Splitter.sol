pragma solidity 0.5.0;

import "./SafeMath.sol";

contract Splitter {
    using SafeMath for uint;

    event LogSplit(address indexed _alice, address indexed _bob, address indexed _carol,
                   uint _bobValue, uint _carolValue);
    event LogPull(address indexed _to, uint _value);

    address public alice;
    address public bob;
    address public carol;

    mapping(address => uint) public balances;

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

        bob = _bob;
        carol = _carol;
    }

    function split() public payable onlyAlice returns (bool success) {
        require(msg.value > 0);

        uint carolValue = (msg.value >> 1);
        uint bobValue = carolValue + (msg.value & 0x01);

        balances[bob] = balances[bob].add(bobValue);
        balances[carol] = balances[carol].add(carolValue);

        emit LogSplit(alice, bob, carol, bobValue, carolValue);

        return true;
    }

    function pull() public returns (bool success) {
        uint balance = balances[msg.sender];

        require(balance > 0);
        assert(address(this).balance >= balance);

        emit LogPull(msg.sender, balance);

        balances[msg.sender] = 0;
        msg.sender.transfer(balance);

        return true;
    }
}