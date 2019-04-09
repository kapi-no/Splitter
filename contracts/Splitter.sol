pragma solidity 0.5.0;

contract Splitter {
    event LogSplit(address indexed _from, address indexed _to, uint _value);

    address alice;
    address payable bob;
    address payable carol;

    modifier onlyAlice {
        require(msg.sender == alice);
        _;
    }

    constructor(address payable _bob, address payable _carol) public {
        alice = tx.origin;

        bob = _bob;
        carol = _carol;
    }

    function split() public payable onlyAlice returns (bool success) {
        uint halvedValue = (msg.value >> 1);

        bob.transfer(halvedValue);
        emit LogSplit(msg.sender, bob, halvedValue);

        carol.transfer(halvedValue);
        emit LogSplit(msg.sender, carol, halvedValue);

        return true;
    }
}