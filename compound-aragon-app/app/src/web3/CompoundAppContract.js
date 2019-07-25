import {toDecimals} from "../lib/math-utils";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";

const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const withdraw = (api, token, recipient, amount, decimals) => {
    const adjustedAmount = toDecimals(amount, decimals)
    api.transfer(token, recipient, adjustedAmount)
        .subscribe()
}

const deposit = (api, tokenAddress, amount, decimals) => {
    const adjustedAmount = toDecimals(amount, decimals)

    if (tokenAddress === ETHER_TOKEN_FAKE_ADDRESS) {
        api.deposit(tokenAddress, adjustedAmount, {value: adjustedAmount})
            .subscribe()
    } else {
        api.deposit(tokenAddress, adjustedAmount, {
            token: {
                address: tokenAddress,
                value: adjustedAmount
            }
        })
            .subscribe()
    }
}

export {
    setAgent,
    withdraw,
    deposit
}