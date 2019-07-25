import {zip} from 'rxjs'
import {mergeMap, map, tap, merge, toArray, first} from "rxjs/operators";
import {agentAddress$, agentApp$, tokenContract$} from "./ExternalContracts";
import {ETHER_TOKEN_FAKE_ADDRESS, ETH_DECIMALS} from "../lib/shared-constants";
import {ETHER_TOKEN_VERIFIED_ADDRESSES} from "../lib/verified-tokens";
import {onErrorReturnDefault} from "../lib/rx-error-operators";

const agentInitializationBlock$ = (api) =>
    agentApp$(api).pipe(
        mergeMap(agent => agent.getInitializationBlock())
    )

const network$ = api =>
    api.network()
        .pipe(first())

const isTokenVerified = (tokenAddress, networkType) =>
    // The verified list is without checksums
    networkType === 'main'
        ? ETHER_TOKEN_VERIFIED_ADDRESSES.has(tokenAddress.toLowerCase())
        : true

const isTokenVerified$ = (api, tokenAddress) =>
    network$(api).pipe(
        map(network => isTokenVerified(tokenAddress, network)))

const agentEthBalance$ = api => {

    const balanceObject = (balance) => ({
        decimals: ETH_DECIMALS.toString(),
        name: "Ether",
        symbol: "ETH",
        address: ETHER_TOKEN_FAKE_ADDRESS,
        amount: balance,
        verified: true,
    })

    return agentApp$(api).pipe(
        mergeMap(agentApp => agentApp.balance(ETHER_TOKEN_FAKE_ADDRESS)),
        map(balance => balanceObject(balance)),
        onErrorReturnDefault('agentEthBalance', balanceObject(0))
    )
}

const agentTokenBalance$ = (api, tokenAddress) => {

    const balanceObject = (decimals, name, symbol, address, balance, isTokenVerified) => ({
        decimals: decimals,
        name: name,
        symbol: symbol,
        address: address,
        amount: balance,
        verified: isTokenVerified,
    })

    return zip(agentAddress$(api), tokenContract$(api, tokenAddress)).pipe(
        mergeMap(([agentAddress, token]) =>
            zip(token.decimals(), token.name(), token.symbol(), token.balanceOf(agentAddress), isTokenVerified$(api, tokenAddress))),
        map(([decimals, name, symbol, balance, tokenVerified]) => balanceObject(decimals, name, symbol, tokenAddress, balance, tokenVerified)),
        onErrorReturnDefault(`agentTokenBalance:${tokenAddress}`, balanceObject(0, "", "", "", 0, false))
    )
}

const balances$ = api =>
    agentEthBalance$(api).pipe(
        // Add whatever tokens you want to see in the app by repeating the merge function below with the correct token address
        // Maybe pass in all the tokens that have been seen in agent vault events...
        // merge(agentTokenBalance$(api, "0x4AB5f04234c2b853655E1468D9732AaaCc826480")),
        toArray(),
        onErrorReturnDefault('agentBalances', [])
    )

export {
    agentInitializationBlock$,
    network$,
    balances$,
}