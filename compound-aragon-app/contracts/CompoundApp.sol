pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";

contract CompoundApp is AragonApp {

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");

    Agent public agent;

    event AppInitialized();
    event NewAgentSet(address agent);

    /**
    * @notice Initialize the Compound App
    * @param _agent The Agent contract address
    */
    function initialize(address _agent) public {
        initialized();

        agent = Agent(_agent);

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

}
