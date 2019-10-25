pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

contract TestERC20 is MintableToken, DetailedERC20("Basic Attention Token", "BAT", 18) {

    constructor() public {
        mint(msg.sender, 1000 * (10 ** 18));
    }

    // Uncomment the below functions and delete the inherited DetailedERC20 contract to test the nonconformant ERC20 DAI token.

//    /**
//     * @dev Returns the name of the token.
//     */
//    function name() public view returns (bytes32) {
//        return 0x44616920537461626c65636f696e2076312e3000000000000000000000000000;
//    }
//
//    /**
//     * @dev Returns the symbol of the token, usually a shorter version of the
//     * name.
//     */
//    function symbol() public view returns (bytes32) {
//        return 0x4441490000000000000000000000000000000000000000000000000000000000;
//    }
//
//    function decimals() public view returns (uint8) {
//        return 18;
//    }
}
