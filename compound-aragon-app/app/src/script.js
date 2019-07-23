import '@babel/polyfill'
import Aragon, {events} from '@aragon/api'
import retryEvery from "./lib/retryEvery"
import {agentAddress$, agentApp$} from "./web3/ExternalContracts";
import {agentEthBalance$, agentInitializationBlock$} from "./web3/ExternalContractsData";

const DEBUG = true; // set to false to disable debug messages.
const debugLog = message => {
    if (DEBUG) {
        console.log(message)
    }
}

const api = new Aragon()

// Wait until we can get the agent address (demonstrating we are connected to the app) before initializing the store.
retryEvery(retry => {
    agentAddress$(api).subscribe(
        () => initialize(),
        error => {
            console.error(
                'Could not start background script execution due to the contract not loading the agent address:',
                error
            )
            retry()
        }
    )
})

async function initialize() {
    api.store(onNewEventCatchError, {
        init: initialState,
        externals: [
            {
                contract: await agentApp$(api).toPromise(),
                initializationBlock: await agentInitializationBlock$(api).toPromise()
            }
        ]
    })
}

const initialState = async (state) => {
    return {
        ...state,
        isSyncing: true,
        agentAddress: await agentAddress$(api).toPromise(),
        agentEthBalance: await agentEthBalance$(api).toPromise(),

    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Script error: ${error}`)
    }
}

const onNewEvent = async (state, storeEvent) => {

    const {event: eventName, address: eventAddress} = storeEvent

    switch (eventName) {
        case events.SYNC_STATUS_SYNCING:
            debugLog("APP SYNCING")
            return {
                ...state,
                isSyncing: true
            }
        case events.SYNC_STATUS_SYNCED:
            debugLog("APP DONE SYNCING")
            return {
                ...state,
                isSyncing: false
            }
        case 'AppInitialized':
            debugLog("APP CONSTRUCTOR EVENT")
            api.identify(`Agent App: ${eventAddress}`)
            return {
                ...state,
                appAddress: eventAddress
            }
        case 'NewAgentSet':
            debugLog("NEW AGENT SET")
            return {
                ...state,
                agentAddress: await agentAddress$(api).toPromise()
            }
        case 'VaultTransfer':
        case 'VaultDeposit':
            debugLog("AGENT TRANSFER")
            return {
                ...state,
                agentEthBalance: await agentEthBalance$(api).toPromise()
            }
        default:
            return state
    }
}