import {deposit, setAgent, withdraw} from "../web3/CompoundAppContract";
import {useApi} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanels} from "./side-panels";

const useSetAgentAddress = (onDone) => {
    const api = useApi()

    return useCallback(address => {
        setAgent(api, address)
        onDone()
    }, [api, onDone])
}

const useDeposit = (onDone) => {
    const api = useApi()

    return useCallback((token, amount, decimals) => {
        deposit(api, token, amount, decimals)
        onDone()
    }, [api, onDone])
}

const useWithdraw = (onDone) => {
    const api = useApi()

    return useCallback((token, recipient, amount, decimals) => {
        withdraw(api, token, recipient, amount, decimals)
        onDone()
    }, [api, onDone])
}

export function useAppLogic() {
    const sidePanelState = useSidePanels()

    const actions = {
        setAgentAddress: useSetAgentAddress(sidePanelState.requestClose),
        deposit: useDeposit(sidePanelState.requestClose),
        withdraw: useWithdraw(sidePanelState.requestClose)
    }

    return {
        actions,
        sidePanelState
    }
}