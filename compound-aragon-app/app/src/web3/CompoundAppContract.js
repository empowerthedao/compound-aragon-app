import {toDecimals} from "../lib/math-utils";
import {ETH_DECIMALS, ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";

const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const withdrawEth = (api, sendToAddress, amount) => {
    const adjustedAmount = toDecimals(amount, ETH_DECIMALS)
    api.transfer(ETHER_TOKEN_FAKE_ADDRESS, sendToAddress, adjustedAmount)
        .subscribe()
}

const depositEth = (api, amount) => {
    const adjustedAmount = toDecimals(amount, ETH_DECIMALS)
    api.deposit(ETHER_TOKEN_FAKE_ADDRESS, adjustedAmount, {value: adjustedAmount})
        .subscribe()
}

export {
    setAgent,
    withdrawEth,
    depositEth
}