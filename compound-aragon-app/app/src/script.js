import '@babel/polyfill'
import Aragon, {events} from '@aragon/api'
import retryEvery from "./lib/retryEvery"
import {agentAddress$} from "./web3/ExternalContracts";

const DEBUG = true; // set to false to disable debug messages.
const debugLog = message => { if (DEBUG) { console.log(message) }}

const api = new Aragon()

// Wait until we can get the agents address (demonstrating we are connected to the app) before initializing the store.
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

const initialize = () => {
    api.store(onNewEventCatchError, { init: initialState })
}

const initialState = async (state) => {
    return {
        ...state,
        agentAddress: await agentAddress$(api).toPromise()
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Caught error: ${error}`)
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
        default:
            return state
    }
}

const onErrorReturnDefault = (errorContext, defaultReturnValue) =>
    catchError(error => {
        console.error(`Error fetching ${errorContext}: ${error}`)
        return of(defaultReturnValue)
    })