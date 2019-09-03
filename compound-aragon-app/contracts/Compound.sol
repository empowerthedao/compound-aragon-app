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

    string private constant ERROR_TOO_MANY_CTOKENS = "COMPOUND_TOO_MANY_CTOKENS";
    string private constant ERROR_TOKEN_ALREADY_ADDED = "COMPOUND_ERROR_TOKEN_ALREADY_ADDED";
    string private constant ERROR_CAN_NOT_DELETE_TOKEN = "COMPOUND_CAN_NOT_DELETE_TOKEN";
    string private constant ERROR_VALUE_MISMATCH = "COMPOUND_VALUE_MISMATCH";
    string private constant ERROR_SEND_REVERTED = "COMPOUND_SEND_REVERTED";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "COMPOUND_TOKEN_TRANSFER_FROM_REVERTED";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "COMPOUND_TOKEN_APPROVE_REVERTED";
    string private constant ERROR_TOKEN_NOT_ENABLED = "COMPOUND_TOKEN_NOT_ENABLED";
    string private constant ERROR_MINT_FAILED = "COMPOUND_MINT_FAILED";
    string private constant ERROR_REDEEM_FAILED = "COMPOUND_REDEEM_FAILED";

    uint256 private constant MAX_ENABLED_CTOKENS = 100;

    Agent public agent;
    address[] public enabledCTokens;

    event AppInitialized();
    event NewAgentSet(address agent);
    event CTokenEnabled(address token);
    event CTokenDisabled(address token);
    event AgentSupply();
    event AgentRedeem();

    modifier cTokenIsEnabled(address _cToken) {
        require(enabledCTokens.contains(_cToken), ERROR_TOKEN_NOT_ENABLED);
        _;
    }

    /**
    * @notice Initialize the Compound App
    * @param _agent The Agent contract address
    */
    function initialize(address _agent, address[] _enabledCTokens) external onlyInit {
        require(_enabledCTokens.length < MAX_ENABLED_CTOKENS, ERROR_TOO_MANY_CTOKENS);

        agent = Agent(_agent);
        enabledCTokens = _enabledCTokens;

        initialized();

        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(address _agent) external auth(SET_AGENT_ROLE) {
        agent = Agent(_agent);
        emit NewAgentSet(_agent);
    }

    /**
    * @notice Add `_cToken' to available Compound Tokens
    * @param _cToken cToken to add
    */
    function enableCToken(address _cToken) external auth(MODIFY_CTOKENS) {
        require(enabledCTokens.length < MAX_ENABLED_CTOKENS, ERROR_TOO_MANY_CTOKENS);
        require(!enabledCTokens.contains(_cToken), ERROR_TOKEN_ALREADY_ADDED);

        enabledCTokens.push(_cToken);
        emit CTokenEnabled(_cToken);
    }

    /**
    * @notice Remove `_cToken' from available Compound Tokens
    * @param _cToken cToken to remove
    */
    function disableCToken(address _cToken) external auth(MODIFY_CTOKENS) {
        require(enabledCTokens.deleteItem(_cToken), ERROR_CAN_NOT_DELETE_TOKEN);
        emit CTokenDisabled(_cToken);
    }

    /**
    * @notice Get all currently enabled cTokens
    */
    function getEnabledCTokens() external view returns (address[]) {
        return enabledCTokens;
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
    function supplyToken(uint256 _amount, address _cToken) external cTokenIsEnabled(_cToken) auth(SUPPLY_ROLE) {
        CTokenInterface cToken = CTokenInterface(_cToken);
        address token = cToken.underlying();

        bytes memory approveFunctionCall = abi.encodeWithSignature("approve(address,uint256)", address(cToken), _amount);
        agent.safeExecute(token, approveFunctionCall);

        bytes memory supplyFunctionCall = abi.encodeWithSignature("mint(uint256)", _amount);
        safeExecuteNoError(_cToken, supplyFunctionCall, ERROR_MINT_FAILED);

        emit AgentSupply();
    }

    /**
    * @notice Redeem `@tokenAmount(self.getUnderlyingToken(_cToken): address, _amount, true, 18)` from Compound
    * @param _amount Amount to redeem
    * @param _cToken cToken to redeem from
    */
    function redeemToken(uint256 _amount, address _cToken) external cTokenIsEnabled(_cToken) auth(REDEEM_ROLE) {
        bytes memory encodedFunctionCall = abi.encodeWithSignature("redeemUnderlying(uint256)", _amount);
        safeExecuteNoError(_cToken, encodedFunctionCall, ERROR_REDEEM_FAILED);

        emit AgentRedeem();
    }

    /**
    * @notice Ensure the returned uint256 from the _data call is 0, representing a successful call
    * @param _target Address where the action is being executed
    * @param _data Calldata for the action
    */
    function safeExecuteNoError(address _target, bytes _data, string memory _error) internal {

        agent.safeExecute(_target, _data);

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