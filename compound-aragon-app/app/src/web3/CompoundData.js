import {agentAddress$, compoundToken$, compoundTokenAddresses$, tokenContract$} from "./ExternalContracts";
import {zip} from "rxjs"
import {concatMap, mergeMap, toArray, map} from "rxjs/operators";
import {onErrorReturnDefault} from "../lib/rx-error-operators";

const tokenSupplyRatePerBlock$ = (api, compoundTokenAddress) =>
    compoundToken$(api, compoundTokenAddress).pipe(
        mergeMap(compoundToken => compoundToken.supplyRatePerBlock()))

const balanceOfUnderlyingTokens$ = (api, compoundTokenAddress) =>
    zip(agentAddress$(api), compoundToken$(api, compoundTokenAddress)).pipe(
        mergeMap(([agentAddress, compoundToken]) => compoundToken.balanceOfUnderlying(agentAddress)))

const compoundTokenDetails$ = (api, compoundTokenAddress) => {

    const tokenObject = (tokenAddress, tokenName, tokenSymbol, supplyRatePerBlock, balanceOfUnderlying) => ({
        tokenAddress,
        tokenName,
        tokenSymbol,
        supplyRatePerBlock,
        balanceOfUnderlying
    })

    return tokenContract$(api, compoundTokenAddress).pipe(
        mergeMap(token => zip(token.name(), token.symbol(), tokenSupplyRatePerBlock$(api, compoundTokenAddress), balanceOfUnderlyingTokens$(api, compoundTokenAddress))),
        map(([name, symbol, supplyRatePerBlock, balanceOfUnderlying]) => tokenObject(compoundTokenAddress, name, symbol, supplyRatePerBlock, balanceOfUnderlying)))
}

// TODO: Consider splitting this up so we don't fetch everything every time an update occurs.
const compoundTokensDetails$ = (api) =>
    compoundTokenAddresses$(api).pipe(
        concatMap(address => address),
        mergeMap(compoundTokenAddress => compoundTokenDetails$(api, compoundTokenAddress)),
        toArray(),
        onErrorReturnDefault('compoundTokensDetails', []))

export {
    compoundTokensDetails$,
}