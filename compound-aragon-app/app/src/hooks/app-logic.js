import {deposit, setAgent, withdraw} from "../web3/CompoundAppContract";
import {useApi, useAppState} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanel} from "./side-panels";

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

    const {isSyncing} = useAppState()

    const transferSidePanelState = useSidePanel()
    const changeAgentSidePanelState = useSidePanel()

    const actions = {
        setAgentAddress: useSetAgentAddress(changeAgentSidePanelState.requestClose),
        deposit: useDeposit(transferSidePanelState.requestClose),
        withdraw: useWithdraw(transferSidePanelState.requestClose)
    }

    return {
        isSyncing,
        actions,
        transferSidePanelState,
        changeAgentSidePanelState
    }
}