pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";
import "./CTokenInterface.sol";
import "./lib/AddressArrayUtils.sol";

contract Compound is AragonApp {

    using SafeERC20 for ERC20;
    using AddressArrayUtils for address[];

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant MODIFY_CTOKENS = keccak256("MODIFY_CTOKENS");
    bytes32 public constant SUPPLY_ROLE = keccak256("SUPPLY_ROLE");
    bytes32 public constant REDEEM_ROLE = keccak256("REDEEM_ROLE");

    string private constant ERROR_VALUE_MISMATCH = "COMPOUND_VALUE_MISMATCH";
    string private constant ERROR_SEND_REVERTED = "COMPOUND_SEND_REVERTED";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "COMPOUND_TOKEN_TRANSFER_FROM_REVERTED";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "COMPOUND_TOKEN_APPROVE_REVERTED";
    string private constant ERROR_INVALID_CTOKEN = "COMPOUND_INVALID_CTOKEN";
    string private constant ERROR_REDEEM_REVERTED = "COMPOUND_REDEEM_REVERTED";
    string private constant ERROR_MINT_FAILED = "COMPOUND_MINT_FAILED";
    string private constant ERROR_REDEEM_FAILED = "COMPOUND_REDEEM_FAILED";

    Agent public agent;
    address[] public cTokens;

    event AppInitialized();
    event NewAgentSet();
    event AddCToken();
    event RemoveCToken();
    event AgentSupply();
    event AgentRedeem();

    /**
    * @notice Initialize the Compound App
    * @param _agent The Agent contract address
    */
    function initialize(address _agent, address[] _cTokens) external onlyInit {
        initialized();

        agent = Agent(_agent);
        cTokens = _cTokens;

        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(address _agent) external auth(SET_AGENT_ROLE) {
        agent = Agent(_agent);
        emit NewAgentSet();
    }

    /**
    * @notice Add `_cToken' to available Compound Tokens
    * @param _cToken cToken to add
    */
    function addCToken(address _cToken) external auth(MODIFY_CTOKENS) {
        cTokens.push(_cToken);
        emit AddCToken();
    }

    /**
    * @notice Remove `_cToken' from available Compound Tokens
    * @param _cToken cToken to remove
    */
    function removeCToken(address _cToken) external auth(MODIFY_CTOKENS) {
        cTokens.deleteItem(_cToken);
        emit RemoveCToken();
    }

    /**
    * @notice Get all currently available cTokens
    */
    function getCTokens() external view returns (address[]) {
        return cTokens;
    }

    /**
    * @notice Deposit `@tokenAmount(_token, _value, true, 18)` to the Compound App's Agent
    * @param _token Address of the token being transferred
    * @param _value Amount of tokens being transferred
    */
    function deposit(address _token, uint256 _value) external payable {
        if (_token == ETH) {
            require(agent.send(_value), ERROR_SEND_REVERTED);
        } else {
            require(ERC20(_token).safeTransferFrom(msg.sender, address(this), _value), ERROR_TOKEN_TRANSFER_FROM_REVERTED);
            require(ERC20(_token).safeApprove(address(agent), _value), ERROR_TOKEN_APPROVE_REVERTED);
            agent.deposit(_token, _value);
        }
    }

    /**
    * @notice Transfer `@tokenAmount(_token, _value, true, 18)` from the Compound App's Agent to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    /* solium-disable-next-line function-order */
    function transfer(address _token, address _to, uint256 _value) external auth(TRANSFER_ROLE) {
        agent.transfer(_token, _to, _value);
    }

    /**
    * @notice Supply `@tokenAmount(self.getUnderlyingToken(_cToken): address, _amount, true, 18)` to Compound
    * @param _amount Amount to supply
    * @param _cToken cToken to supply to
    */
    function supplyToken(uint256 _amount, address _cToken) external auth(SUPPLY_ROLE) {
        require(cTokens.contains(_cToken), ERROR_INVALID_CTOKEN);

        CTokenInterface cToken = CTokenInterface(_cToken);
        address token = cToken.underlying();

        bytes memory approveFunctionCall = abi.encodeWithSignature("approve(address,uint256)", address(cToken), _amount);
        agent.execute(token, 0, approveFunctionCall);

        bytes memory supplyFunctionCall = abi.encodeWithSignature("mint(uint256)", _amount);
        executeNoError(_cToken, 0, supplyFunctionCall, ERROR_MINT_FAILED);

        emit AgentSupply();
    }

    /**
    * @notice Redeem `@tokenAmount(self.getUnderlyingToken(_cToken): address, _amount, true, 18)` from Compound
    * @param _amount Amount to redeem
    * @param _cToken cToken to redeem from
    */
    function redeemToken(uint256 _amount, address _cToken) external auth(REDEEM_ROLE) {
        require(cTokens.contains(_cToken), ERROR_INVALID_CTOKEN);

        bytes memory encodedFunctionCall = abi.encodeWithSignature("redeemUnderlying(uint256)", _amount);
        executeNoError(_cToken, 0, encodedFunctionCall, ERROR_REDEEM_FAILED);

        emit AgentRedeem();
    }

    /**
    * @notice Ensure the returned uint256 from the _data call is 0, representing a successful call
    * @param _target Address where the action is being executed
    * @param _ethValue Amount of ETH from the contract that is sent with the action
    * @param _data Calldata for the action
    */
    function executeNoError(address _target, uint256 _ethValue, bytes _data, string memory _error) internal {

        agent.execute(_target, _ethValue, _data);

        uint256 callReturnValue;

        assembly {
            switch returndatasize                 // get return data size from the previous call
            case 0x20 {                           // if the return data size is 32 bytes (1 word/uint256)
                let output := mload(0x40)         // get a free memory pointer
                mstore(0x40, add(output, 0x20))   // set the free memory pointer 32 bytes
                returndatacopy(output, 0, 0x20)   // copy the first 32 bytes of data into output
                callReturnValue := mload(output)  // read the data from output
            }
            default {
                revert(0, 0) // revert on unexpected return data size
            }
        }

        require(callReturnValue == 0, _error);
    }

    /**
    * @dev Convenience function for getting token addresses in radspec strings
    * @notice Get underlying token from CToken.
    * @param _cToken cToken to find underlying from
    */
    function getUnderlyingToken(address _cToken) public view returns (address) {
        return CTokenInterface(_cToken).underlying();
    }
}