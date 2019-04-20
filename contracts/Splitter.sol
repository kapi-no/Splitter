pragma solidity 0.5.7;

import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Splitter {
    using SafeMath for uint;

    event LogSplit(address indexed _alice, address indexed _bob, address indexed _carol,
                   uint _bobValue, uint _carolValue);
    event LogPull(address indexed _to, uint _value);

    mapping(address => uint) public balances;

    function split(address bob, address carol) public payable returns (bool success) {
        require(msg.value > 0);
        require(bob != address(0));
        require(carol != address(0));
        require(msg.sender != bob);
        require(msg.sender != carol);
        require(bob != carol);

        uint carolValue = (msg.value >> 1);
        uint bobValue = carolValue + (msg.value & 0x01);

        balances[bob] = balances[bob].add(bobValue);
        balances[carol] = balances[carol].add(carolValue);

        emit LogSplit(msg.sender, bob, carol, bobValue, carolValue);

        return true;
    }

    function pull() public returns (bool success) {
        uint senderBalance = balances[msg.sender];

        require(senderBalance > 0);
        assert(address(this).balance >= senderBalance);

        emit LogPull(msg.sender, senderBalance);

        balances[msg.sender] = 0;
        msg.sender.transfer(senderBalance);

        return true;
    }
}