import { agentAddress$, compoundToken$, compoundTokenAddresses$, tokenContract$ } from "./ExternalContracts"
import {zip} from "rxjs"
import {concatMap, mergeMap, toArray, map} from "rxjs/operators";
import {onErrorReturnDefault} from "../lib/rx-error-operators";

const balanceOfUnderlyingTokens$ = (api, compoundTokenAddress) =>
    zip(agentAddress$(api), compoundToken$(api, compoundTokenAddress)).pipe(
        mergeMap(([agentAddress, compoundToken]) => compoundToken.balanceOfUnderlying(agentAddress)))

const balanceOfToken$ = (api, tokenAddress) =>
    zip(agentAddress$(api), tokenContract$(api, tokenAddress)).pipe(
        mergeMap(([agentAddress, token]) => token.balanceOf(agentAddress)))

const compoundTokenDetails$ = (api, compoundTokenAddress, state) => {

    const tokenObject = (tokenAddress, tokenName, tokenSymbol, underlyingToken, supplyRatePerBlock, balanceOfUnderlying, exchangeRateStored) => ({
        ...((state || {}).compoundTokens || [])
            .find(compoundToken => compoundToken.tokenAddress === compoundTokenAddress) || {},
        tokenAddress,
        tokenName,
        tokenSymbol,
        underlyingToken,
        supplyRatePerBlock,
        balanceOfUnderlying,
        exchangeRateStored
    })

    return compoundToken$(api, compoundTokenAddress).pipe(
        mergeMap(token => zip(token.name(), token.symbol(), token.supplyRatePerBlock(),
            balanceOfUnderlyingTokens$(api, compoundTokenAddress), token.underlying(), token.exchangeRateStored())),
        map(([name, symbol, supplyRatePerBlock, balanceOfUnderlying, underlyingToken, exchangeRateStored]) =>
            tokenObject(compoundTokenAddress, name, symbol, underlyingToken, supplyRatePerBlock, balanceOfUnderlying, exchangeRateStored)))
}

const compoundTokensDetails$ = (api, state) =>
    compoundTokenAddresses$(api).pipe(
        concatMap(address => address),
        mergeMap(compoundTokenAddress => compoundTokenDetails$(api, compoundTokenAddress, state)),
        toArray(),
        onErrorReturnDefault('compoundTokensDetails', []))

export {
    compoundTokensDetails$,
    balanceOfUnderlyingTokens$,
    balanceOfToken$
}