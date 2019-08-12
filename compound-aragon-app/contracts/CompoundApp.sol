pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";
import "@ensdomains/buffer/contracts/Buffer.sol";
import "./CTokenInterface.sol";
import "./lib/AddressArrayUtils.sol";

contract CompoundApp is AragonApp {

    using SafeERC20 for ERC20;
    using Buffer for Buffer.buffer;
    using AddressArrayUtils for address[];

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant MODIFY_CTOKENS = keccak256("MODIFY_CTOKENS");
    bytes32 public constant LEND_ROLE = keccak256("LEND_ROLE");
    bytes32 public constant REDEEM_ROLE = keccak256("REDEEM_ROLE");

    string private constant ERROR_VALUE_MISMATCH = "COMPOUND_VALUE_MISMATCH";
    string private constant ERROR_SEND_REVERTED = "COMPOUND_SEND_REVERTED";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "COMPOUND_TOKEN_TRANSFER_FROM_REVERTED";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "COMPOUND_TOKEN_APPROVE_REVERTED";
    string private constant ERROR_INVALID_CTOKEN = "COMPOUND_INVALID_CTOKEN";

    Agent public agent;
    address[] public cTokens;

    event AppInitialized();
    event NewAgentSet();
    event AddCToken();
    event RemoveCToken();
    event Lend();
    event Redeem();

    /**
    * @notice Initialize the Compound App
    * @param _agent The Agent contract address
    */
    function initialize(address _agent, address[] _cTokens) public {
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
    * @notice Deposit `@tokenAmount(_token, _value, true, 18)` tokens to the Compound App's Agent
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
    * @notice Lend `@tokenAmount(self.getUnderlyingToken(_cToken): address, _amount, true, 18)` to Compound
    * @param _amount Amount to lend
    * @param _cToken cToken to lend to
    */
    function lendToken(uint256 _amount, address _cToken) external auth(LEND_ROLE) {
        require(cTokens.contains(_cToken), ERROR_INVALID_CTOKEN);

        bytes memory spec1 = hex"00000001";
        Buffer.buffer memory byteBuffer;
        CTokenInterface cToken = CTokenInterface(_cToken);
        address token = cToken.underlying();

        bytes memory approveFunctionCall = abi.encodeWithSignature("approve(address,uint256)", address(cToken), _amount);
        bytes memory lendFunctionCall = abi.encodeWithSignature("mint(uint256)", _amount);

        byteBuffer.init(182);
        byteBuffer.append(spec1);
        _appendForwarderScript(byteBuffer, token, approveFunctionCall);
        _appendForwarderScript(byteBuffer, cToken, lendFunctionCall);

        emit Lend();

        agent.forward(byteBuffer.buf);
    }

    /**
    * @notice Redeem `@tokenAmount(self.getUnderlyingToken(_cToken): address, _amount, true, 18)` from Compound
    * @param _amount Amount to redeem
    * @param _cToken cToken to redeem from
    */
    function redeemToken(uint256 _amount, address _cToken) external auth(REDEEM_ROLE) {
        require(cTokens.contains(_cToken), ERROR_INVALID_CTOKEN);
        bytes memory encodedFunctionCall = abi.encodeWithSignature("redeemUnderlying(uint256)", _amount);

        emit Redeem();

        agent.execute(_cToken, 0, encodedFunctionCall);
    }

    /**
    * @dev Convenience function for getting token addresses in radspec strings
    * @notice Get underlying token from CToken.
    * @param _cToken cToken to find underlying from
    */
    function getUnderlyingToken(address _cToken) public view returns (address) {
        return CTokenInterface(_cToken).underlying();
    }

    function _appendForwarderScript(Buffer.buffer memory _byteBuffer, address _toAddress, bytes memory _functionCall)
    internal
    pure
    {
        bytes memory toAddressBytes = abi.encodePacked(_toAddress);
        bytes memory functionCallLength = abi.encodePacked(bytes4(_functionCall.length));

        _byteBuffer.append(toAddressBytes);
        _byteBuffer.append(functionCallLength);
        _byteBuffer.append(_functionCall);
    }
}