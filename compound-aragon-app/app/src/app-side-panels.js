import React, {useState} from 'react'
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";
import {deposit, setAgent, withdraw} from "./web3/CompoundAppContract";
import TransferPanel from "./components/side-panel-input/transfer/TransferPanel"

const useSidePanelActions = (api, closeSidePanel) => {

    return {

        setAgentAddress: (address) => {
            closeSidePanel()
            setAgent(api, address)
        },

        deposit: (token, amount, decimals) => {
            closeSidePanel()
            deposit(api, token, amount, decimals)
        },

        withdraw: (token, recipient, amount, decimals) => {
            closeSidePanel()
            withdraw(api, token, recipient, amount, decimals)
        }

    }
}

const useSidePanels = (api, appState) => {

    const [openSidePanel, setSidePanel] = useState(undefined)

    const closeSidePanel = () => setSidePanel(undefined)

    const sidePanelActions = useSidePanelActions(api, closeSidePanel)

    const sidePanels = {
        CHANGE_AGENT: {
            title: 'Change the Agent',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Compound Action'}
                                   actionDescription={`This action will change the Agent which represents an Externally 
                                        Owned Account (EOA) and is responsible for interacting with the Compound protocol.`}
                                   inputFieldList={[
                                       {id: 1, label: 'address', type: 'text'}]}
                                   submitLabel={'Change agent'}
                                   handleSubmit={sidePanelActions.setAgentAddress}/>
            )
        },
        TRANSFER: {
            title: 'New Agent Transfer',
            sidePanelComponent: (
                <TransferPanel appState={appState}
                               handleDeposit={sidePanelActions.deposit}
                               handleWithdraw={sidePanelActions.withdraw}/>
            )
        }
    }

    const openSidePanelActions = {
        changeAgent: () => setSidePanel(sidePanels.CHANGE_AGENT),
        transfer: () => setSidePanel(sidePanels.TRANSFER)
    }

    return {
        openSidePanel,
        openSidePanelActions,
        closeSidePanel
    }
}

export {
    useSidePanels
}
