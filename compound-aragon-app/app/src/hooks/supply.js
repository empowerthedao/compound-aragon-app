import {useAppState} from "@aragon/api-react";

export function useSupplyState() {
    const {balances, compoundTokens, network} = useAppState()

    return {
        balances,
        compoundTokens,
        network
    }
}