import {fromDecimals} from "./lib/math-utils";
import {ETH_DECIMALS} from "./SharedConstants";

let defaultState = {
    isSyncing: true,
    appAddress: '0x0000000000000000000000000000000000000000',
    agentAddress: '0x0000000000000000000000000000000000000000',
    agentEthBalance: '0'
}

const reducer = state => {

    if (state === null) {
        return defaultState
    }

    const {
        agentEthBalance
    } = state

    return {
        ...state,
        agentEthBalance: fromDecimals(agentEthBalance.toString(), ETH_DECIMALS)
    }
}

export default reducer