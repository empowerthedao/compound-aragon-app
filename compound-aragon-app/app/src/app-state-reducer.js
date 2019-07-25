import {fromDecimals} from "./lib/math-utils";
import BN from 'bn.js'

let defaultState = {
    isSyncing: true,
    appAddress: '0x0000000000000000000000000000000000000000',
    agentAddress: '0x0000000000000000000000000000000000000000',
}

const reducer = state => {

    if (state === null) {
        state = defaultState
    }

    const {
        balances
    } = state

    const balancesBn = balances
        ? balances
            .map(balance => {

                console.log("BALANCE AMOUNT")
                console.log(balance.amount)

                return {
                    ...balance,
                    amount: new BN(balance.amount),
                    decimals: new BN(balance.decimals),

                    // Note that numbers in `numData` are not safe for accurate
                    // computations (but are useful for making divisions easier).
                    numData: {
                        amount: parseInt(balance.amount, 10),
                        decimals: parseInt(balance.decimals, 10),
                    },
                }
            })
        : []

    return {
        ...state,
        balances: balancesBn
    }
}

const fromDecimalsDefaultIfNull = (value, decimals, defaultValue) => {
    return value ? fromDecimals(value.toString(), decimals) : defaultValue
}

export default reducer