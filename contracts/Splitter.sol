pragma solidity 0.5.7;

import "./SafeMath.sol";

contract Splitter {
    using SafeMath for uint;

    event LogSplit(address indexed _alice, address indexed _bob, address indexed _carol,
                   uint _bobValue, uint _carolValue);
    event LogPull(address indexed _to, uint _value);

    mapping(address => uint) public balances;

    function split(address bob, address carol) public payable returns (bool success) {
        uint aliceValue = msg.value;

        require(aliceValue > 0);

        address alice = msg.sender;

        require(bob != address(0));
        require(carol != address(0));
        require(alice != bob);
        require(alice != carol);
        require(bob != carol);

        uint carolValue = (aliceValue >> 1);
        uint bobValue = carolValue + (aliceValue & 0x01);

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