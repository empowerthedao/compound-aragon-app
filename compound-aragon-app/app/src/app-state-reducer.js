
let defaultState = {
    isSyncing: true,
    agentAddress: '0x0000000000000000000000000000000000000000',
    appAddress: '0x0000000000000000000000000000000000000000'
}

const reducer = state => {

    if (state === null) {
        return defaultState
    }

    return state
}

export default reducer