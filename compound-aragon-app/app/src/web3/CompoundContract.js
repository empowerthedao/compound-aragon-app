import {toDecimals} from "../lib/math-utils";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";
import {tokenContract$} from "./ExternalContracts";
import {mergeMap, tap} from 'rxjs/operators'

const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

async function deposit(api, tokenAddress, amount, decimals) {

    if (decimals === -1) {
        decimals = await tokenContract$(api, tokenAddress).pipe(
            mergeMap(token => token.decimals())).toPromise()
        decimals = parseInt(decimals)
    }

    const adjustedAmount = toDecimals(amount, decimals)

    if (tokenAddress === ETHER_TOKEN_FAKE_ADDRESS) {
        api.deposit(tokenAddress, adjustedAmount, {value: adjustedAmount})
            .subscribe()
    } else {
        api.deposit(tokenAddress, adjustedAmount, {
            token: {
                address: tokenAddress,
                value: adjustedAmount
            },
            // Hardcoded gas to prevent MetaMask doing gas estimation and telling the user that their
            // transaction will fail (before the approve is mined).
            gas: 450000
        })
            .subscribe()
    }
}

const withdraw = (api, token, recipient, amount, decimals) => {
    const adjustedAmount = toDecimals(amount, decimals)
    api.transfer(token, recipient, adjustedAmount)
        .subscribe()
}

const supplyToken = (api, amount) => {
    const adjustedAmount = toDecimals(amount, 18)

    api.call('enabledCErc20s', 0).pipe(
        mergeMap(cToken => api.supplyToken(adjustedAmount, cToken)))
        .subscribe()
}

const redeemToken = (api, amount) => {
    const adjustedAmount = toDecimals(amount, 18)

    api.call('enabledCErc20s', 0).pipe(
        mergeMap(cToken => api.redeemToken(adjustedAmount, cToken)))
        .subscribe()
}

export {
    setAgent,
    deposit,
    withdraw,
    supplyToken,
    redeemToken
}