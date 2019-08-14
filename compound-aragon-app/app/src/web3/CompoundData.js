import {agentAddress$, compoundToken$, compoundTokenAddresses$} from "./ExternalContracts";
import {zip} from "rxjs"
import {concatMap, mergeMap, toArray, map} from "rxjs/operators";
import {onErrorReturnDefault} from "../lib/rx-error-operators";

const balanceOfUnderlyingTokens$ = (api, compoundTokenAddress) =>
    zip(agentAddress$(api), compoundToken$(api, compoundTokenAddress)).pipe(
        mergeMap(([agentAddress, compoundToken]) => compoundToken.balanceOfUnderlying(agentAddress)))

const compoundTokenDetails$ = (api, compoundTokenAddress) => {

    const tokenObject = (tokenAddress, tokenName, tokenSymbol, underlyingToken, supplyRatePerBlock, balanceOfUnderlying) => ({
        tokenAddress,
        tokenName,
        tokenSymbol,
        underlyingToken,
        supplyRatePerBlock,
        balanceOfUnderlying
    })

    return compoundToken$(api, compoundTokenAddress).pipe(
        mergeMap(token => zip(token.name(), token.symbol(), token.supplyRatePerBlock(),
            balanceOfUnderlyingTokens$(api, compoundTokenAddress), token.underlying())),
        map(([name, symbol, supplyRatePerBlock, balanceOfUnderlying, underlyingToken]) =>
            tokenObject(compoundTokenAddress, name, symbol, underlyingToken, supplyRatePerBlock, balanceOfUnderlying)))
}

// TODO: Consider splitting this up so we don't fetch everything for every cToken every time an update occurs.
const compoundTokensDetails$ = (api) =>
    compoundTokenAddresses$(api).pipe(
        concatMap(address => address),
        mergeMap(compoundTokenAddress => compoundTokenDetails$(api, compoundTokenAddress)),
        toArray(),
        onErrorReturnDefault('compoundTokensDetails', []))

export {
    compoundTokensDetails$,
}