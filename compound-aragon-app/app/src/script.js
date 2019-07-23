import '@babel/polyfill'
import Aragon, {events} from '@aragon/api'
import retryEvery from "./lib/retryEvery"
import {agentAddress$, agentApp$} from "./web3/ExternalContracts";
import {zip, of} from 'rxjs'
import {catchError, flatMap, mergeMap} from "rxjs/operators";
import {ETHER_TOKEN_FAKE_ADDRESS} from "./SharedConstants";

const DEBUG = true; // set to false to disable debug messages.
const debugLog = message => {
    if (DEBUG) {
        console.log(message)
    }
}

const api = new Aragon()

// Wait until we can get the agent contract (demonstrating we are connected to the app) before initializing the store.
retryEvery(retry => {
    agentApp$(api).subscribe(
        agentApp => initialize(agentApp),
        error => {
            console.error(
                'Could not start background script execution due to the contract not loading the contracts:',
                error
            )
            retry()
        }
    )
})

const initialize = (agentApp) => {
    api.store(onNewEventCatchError, {
        init: initialState,
        externals: [
            {contract: agentApp} // TODO: Probably specify initializationBlock
        ]
    })
}

const initialState = async (state) => {
    return {
        ...state,
        isSyncing: true,
        agentAddress: await agentAddress$(api).toPromise(),
        agentEthBalance: await agentEthBalance$().toPromise(),

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
                agentEthBalance: await agentEthBalance$().toPromise()
            }
        default:
            return state
    }
}

const onErrorReturnDefault = (errorContext, defaultReturnValue) =>
    catchError(error => {
        console.error(`Script error fetching ${errorContext}: ${error}`)
        return of(defaultReturnValue)
    })

const agentEthBalance$ = () =>
    agentApp$(api).pipe(
        mergeMap(agentApp => agentApp.balance(ETHER_TOKEN_FAKE_ADDRESS)),
        onErrorReturnDefault('agentEthBalance', 0))