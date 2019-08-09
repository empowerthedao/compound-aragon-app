import {useAppState} from "@aragon/api-react";

export function useLendState() {
    const {balances} = useAppState()

    return {
        balances
    }
}