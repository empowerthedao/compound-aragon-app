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

    const convertedBalances = balances
        ? balances
            .map(balance => ({
                    ...balance,
                    amount: new BN(balance.amount),
                    decimals: new BN(balance.decimals),

                    // Note that numbers in `numData` are not safe for accurate
                    // computations (but are useful for making divisions easier).
                    numData: {
                        amount: parseInt(balance.amount, 10),
                        decimals: parseInt(balance.decimals, 10),
                    },
                })
            )
        : []

    const tokens = convertedBalances.map(
        ({ address, name, symbol, numData: { amount, decimals }, verified }) => ({
            address,
            amount,
            decimals,
            name,
            symbol,
            verified,
        })
    )

    return {
        ...state,
        balances: convertedBalances,
        tokens
    }
}

const fromDecimalsDefaultIfNull = (value, decimals, defaultValue) => {
    return value ? fromDecimals(value ? value.toString() : "0", decimals) : defaultValue
}

export default reducer