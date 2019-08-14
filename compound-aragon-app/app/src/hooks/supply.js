import {useAppState} from "@aragon/api-react";

export function useSupplyState() {
    const {balances, compoundTokens, network, tokens} = useAppState()

    return {
        balances,
        compoundTokens,
        network,
        tokens
    }
}