import '@babel/polyfill'
import Aragon, {events} from '@aragon/api'
import retryEvery from "./lib/retry-every"
import {agentAddress$, agentApp$, allCompoundTokens$} from "./web3/ExternalContracts";
import {agentInitializationBlock$, agentBalances$} from "./web3/AgentData";
import {ETHER_TOKEN_FAKE_ADDRESS} from "./lib/shared-constants";
import {compoundTokensDetails$} from "./web3/CompoundData";
import BN from 'bn.js'

// TODO: Only fetch data for events triggered by the Agent address.
const DEBUG_LOGS = true;
const debugLog = message => {
    if (DEBUG_LOGS) {
        console.debug(message)
    }
}

const activeTokens = state => state ? state.activeTokens ? state.activeTokens : [] : []

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
            },
            ...await allCompoundTokens$(api).toPromise()
        ]
    })
}

const initialState = async (cachedInitState) => {
    try {
        return {
            ...cachedInitState,
            isSyncing: true,
            agentAddress: await agentAddress$(api).toPromise(),
            balances: await agentBalances$(api, activeTokens(cachedInitState)).toPromise(),
            compoundTokens: await compoundTokensDetails$(api, cachedInitState).toPromise(),
        }
    } catch (error) {
        console.error(`Script init error: ${error}`)
        return state
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Script event error: ${error}`)
    }
}

const onNewEvent = async (state, storeEvent) => {

    const {
        event: eventName,
        address: eventAddress,
        returnValues: eventParams
    } = storeEvent

    // console.log("Store Event:")
    // console.log(storeEvent)

    // console.log("Current state:")
    // console.log(state)

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
            let newActiveTokens = [...state.activeTokens || []]
            if (storeEvent.returnValues.token !== ETHER_TOKEN_FAKE_ADDRESS) {
                newActiveTokens.push(storeEvent.returnValues.token)
            }
            newActiveTokens = [...new Set(newActiveTokens)]
            return {
                ...state,
                balances: await agentBalances$(api, newActiveTokens).toPromise(),
                activeTokens: newActiveTokens
            }
        case 'ProxyDeposit':
            debugLog("ETH DEPOSIT")
            return {
                ...state,
                balances: await agentBalances$(api, activeTokens(state)).toPromise()
            }
        case 'AgentSupply':
        case 'AgentRedeem':
            debugLog("SUPPLY/REDEEM")
            return {
                ...state,
                balances: await agentBalances$(api, activeTokens(state)).toPromise(),
                compoundTokens: await compoundTokensDetails$(api, state).toPromise(),
            }
        case 'AccrueInterest':
            debugLog("ACCRUE INTEREST")
            return {
                ...state,
                compoundTokens: await compoundTokensDetails$(api, state).toPromise(),
            }
        case 'Mint':
            debugLog("MINT")
            const {minter, mintAmount} = eventParams
            if (state.agentAddress === minter) {

                const compoundTokensWithMintTransaction =
                    await compoundTokensWithTransaction(state.compoundTokens, storeEvent, mintAmount, "MINT")

                const compoundTokensWithMintInterest =
                    await compoundTokensWithInterest(compoundTokensWithMintTransaction, storeEvent,
                    (lifetimeInterestEarned) => lifetimeInterestEarned.totalTransferredToAgent =
                        new BN(lifetimeInterestEarned.totalTransferredToAgent).add(new BN(mintAmount)).toString())

                return {
                    ...state,
                    compoundTokens: compoundTokensWithMintInterest
                }
            }
            return state
        case 'Redeem':
            debugLog("REDEEM")
            const {redeemer, redeemAmount} = eventParams
            if (state.agentAddress === redeemer) {

                const compoundTokensWithRedeemTransaction =
                    await compoundTokensWithTransaction(state.compoundTokens, storeEvent, redeemAmount, "REDEEM")

                const compoundTokensWithRedeemInterest =
                    await compoundTokensWithInterest(compoundTokensWithRedeemTransaction, storeEvent,
                        (lifetimeInterestEarned) => lifetimeInterestEarned.totalTransferredFromAgent =
                            new BN(lifetimeInterestEarned.totalTransferredFromAgent).add(new BN(redeemAmount)).toString())

                return {
                    ...state,
                    compoundTokens: compoundTokensWithRedeemInterest
                }
            }
            return state
        default:
            return state
    }
}

const mapCompoundTokenInCompoundTokensTo = (compoundTokens, compoundTokenAddress, mapCompoundTokenFunction) =>
    compoundTokens
        .filter(compoundToken => compoundToken.tokenAddress === compoundTokenAddress)
        .map(mapCompoundTokenFunction)
        .reduce((newCompoundTokens, compoundToken) => [...newCompoundTokens, compoundToken],
            compoundTokens.filter(compoundToken => compoundToken.tokenAddress !== compoundTokenAddress))

const compoundTokensWithTransaction = async (compoundTokens, storeEvent, transferAmount, type) => {

    const {blockNumber, transactionHash, address: eventContractAddress} = storeEvent
    const eventBlock = await api.web3Eth('getBlock', blockNumber).toPromise()

    return mapCompoundTokenInCompoundTokensTo(compoundTokens, eventContractAddress, compoundToken => {

        const newCompoundTransactions = [...compoundToken.compoundTransactions || []]

        const transactionNotInState = !newCompoundTransactions.find(transactionObject => transactionObject.transactionHash === transactionHash)

        if (transactionNotInState) {
            newCompoundTransactions.push({
                transactionHash,
                type,
                transferAmount,
                timestamp: eventBlock.timestamp,
            })
        }

        return {...compoundToken, compoundTransactions: newCompoundTransactions}
    })
}

const initialLifetimeInterestEarned = {
    fromTransactions: [],
    totalTransferredToAgent: '0',
    totalTransferredFromAgent: '0'
}

const compoundTokensWithInterest = (compoundTokens, storeEvent, modifyInterestEarnedFunction) => {

    const {transactionHash, address: eventAddress} = storeEvent

    return mapCompoundTokenInCompoundTokensTo(compoundTokens, eventAddress, compoundToken => {
        const newLifetimeInterestEarned = (compoundToken.lifetimeInterestEarned || initialLifetimeInterestEarned)

        if (!newLifetimeInterestEarned.fromTransactions.includes(transactionHash)) {
            newLifetimeInterestEarned.fromTransactions.push(transactionHash)
            modifyInterestEarnedFunction(newLifetimeInterestEarned)
        }

        return {...compoundToken, lifetimeInterestEarned: newLifetimeInterestEarned}
    })
}
