import {toDecimals} from "../lib/math-utils";
import {ETH_DECIMALS, ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";

const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const withdraw = (api, token, recipient, amount, decimals) => {
    const adjustedAmount = toDecimals(amount, decimals)
    api.transfer(token, recipient, adjustedAmount)
        .subscribe()
}

const deposit = (api, token, amount, decimals) => {
    const adjustedAmount = toDecimals(amount, decimals)
    let ethValue = 0

    if (token === ETHER_TOKEN_FAKE_ADDRESS) {
        ethValue = adjustedAmount
    }

    api.deposit(token, adjustedAmount, {value: ethValue})
        .subscribe()
}

export {
    setAgent,
    withdraw,
    deposit
}