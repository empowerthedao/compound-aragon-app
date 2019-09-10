import {useCallback} from 'react'
import {useApi, useAragonApi} from "@aragon/api-react";
import {tokenContract$} from "../web3/ExternalContracts";
import {mergeMap, map} from "rxjs/operators";
import {toDecimals} from "../lib/math-utils";
import {zip} from "rxjs";
import BN from 'bn.js'
import {isAddress} from "@aragon/ui";
import {ETH_DECIMALS, ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";

const useCheckBalance = () => {
    const api = useApi()
    const { connectedAccount } = useAragonApi()

    return useCallback((tokenAddress, amount, setBalanceAvailable) => {

        if (!isAddress(tokenAddress)) {
            setBalanceAvailable(true)
            return
        }

        if (tokenAddress === ETHER_TOKEN_FAKE_ADDRESS) {
            api.web3Eth('getBalance', connectedAccount).pipe(
                map(userBalance => {
                    const adjustedAmount = toDecimals(amount.toString(), ETH_DECIMALS)
                    const adjustedAmountBn = new BN(adjustedAmount)
                    return adjustedAmountBn.lt(new BN(userBalance))
                })
            ).subscribe(setBalanceAvailable)
        } else {
            const adjustedAmountBn$ = token => token.decimals().pipe(
                map(decimals => toDecimals(amount.toString(), parseInt(decimals))),
                map(adjustedAmount => new BN(adjustedAmount)))

            tokenContract$(api, tokenAddress).pipe(
                mergeMap(token => zip(adjustedAmountBn$(token), token.balanceOf(connectedAccount))),
                map(([adjustedAmountBn, userBalance]) => adjustedAmountBn.lt(new BN(userBalance)))
            ).subscribe(setBalanceAvailable)
        }

    }, [api, connectedAccount])
}

const useDepositState = () => {

    return {
        checkBalance: useCheckBalance()
    }
}

export {
    useDepositState
}