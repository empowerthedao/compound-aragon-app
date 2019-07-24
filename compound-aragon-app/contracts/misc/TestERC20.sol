pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract TestERC20 is MintableToken {

    constructor() public {
        mint(msg.sender, 1000 * (10**18));
    }
}
