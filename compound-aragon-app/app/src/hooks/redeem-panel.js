import {useCallback} from 'react'
import {useApi} from "@aragon/api-react";
import {balanceOfUnderlyingTokens$} from "../web3/CompoundData";
import {map} from "rxjs/operators";
import {fromDecimals} from "../lib/math-utils";
import {useAppState} from "@aragon/api-react";

export function useGetMaxRedeemable() {
    const api = useApi()
    const {compoundTokens, tokens} = useAppState()

    return useCallback((maxRedeemableCallback) => {

        const compoundToken = compoundTokens[0] || {}
        const {tokenAddress, underlyingToken: underlyingTokenAddress} = compoundToken

        const {decimals: underlyingTokenDecimals} = tokens.find(token => token.address === underlyingTokenAddress)

        balanceOfUnderlyingTokens$(api, tokenAddress).pipe(
            map(maxRedeemable => fromDecimals(maxRedeemable.toString(), underlyingTokenDecimals)))
            .subscribe(maxRedeemable => maxRedeemableCallback(maxRedeemable))

    }, [api, compoundTokens])
}

export function useRedeemState() {

    return {
        getMaxRedeemable: useGetMaxRedeemable()
    }
}