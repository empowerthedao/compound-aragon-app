pragma solidity ^0.4.24;

contract CErc20Interface {

    address public underlying;

    function balanceOfUnderlying(address owner) external returns (uint);

}
