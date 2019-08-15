import {useAppState} from "@aragon/api-react";

// TODO: Move supply logic to here.
export function useSupplyState() {
    const {balances, compoundTokens, network, tokens} = useAppState()

    return {
        balances,
        compoundTokens,
        network,
        tokens
    }
}