pragma solidity ^0.4.24;

contract CErc20Interface {

    address public underlying;

    function balance(address owner) external returns (uint256);

    function exchangeRateStored() public view returns (uint256);

}
