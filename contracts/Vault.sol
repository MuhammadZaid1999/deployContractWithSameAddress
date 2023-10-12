// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Vault {

    mapping (address => uint) userBalance;
    mapping (address => uint) unLockTime;

    event Deposit(uint amount, uint when);
    event Withdrawal(uint amount, uint when);

    function deposit(uint _unlockTime) payable public {
        userBalance[msg.sender] += msg.value;
        unLockTime[msg.sender] = _unlockTime;
        emit Deposit(msg.value, block.timestamp);
    }

    function withdraw() public {
        require(block.timestamp >= unLockTime[msg.sender], "You can't withdraw yet");
        payable(msg.sender).transfer(userBalance[msg.sender]);
        emit Withdrawal(userBalance[msg.sender], block.timestamp);
    }
}