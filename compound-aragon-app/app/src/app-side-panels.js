import React, {useState} from 'react'
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";
import {depositEth, setAgent, withdrawEth} from "./web3/CompoundAppContract";

const useSidePanelActions = (api, closeSidePanel) => {

    return {

        setAgentAddress: (address) => {
            closeSidePanel()
            setAgent(api, address)
        },

        withdrawEth: (sendTo, amount) => {
            closeSidePanel()
            withdrawEth(api, sendTo, amount)
        },

        depositEth: (amount) => {
            closeSidePanel()
            depositEth(api, amount)
        }

    }
}

const useSidePanels = (api) => {

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
        TRANSFER_ETH_OUT: {
            title: 'Withdraw Ethereum From App',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Transfer Action'}
                                   actionDescription={`This action will transfer the specified amount of Ethereum (ETH)
                                   from the Compound App's Agent to the address specified.`}
                                   inputFieldList={[
                                       {id: 1, label: 'address', type: 'text'},
                                       {id: 2, label: 'amount', type: 'number'}]}
                                   submitLabel={'Withdraw'}
                                   handleSubmit={sidePanelActions.withdrawEth}/>
            )
        },
        TRANSFER_ETH_IN: {
            title: 'Deposit Ethereum To App',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Transfer Action'}
                                   actionDescription={`This action will transfer the specified amount of Ethereum (ETH)
                                   to the Compound App's Agent from your wallet.`}
                                   inputFieldList={[
                                       {id: 1, label: 'amount', type: 'number'}]}
                                   submitLabel={'Deposit'}
                                   handleSubmit={sidePanelActions.depositEth}/>
            )
        },
    }

    const openSidePanelActions = {
        changeAgent: () => setSidePanel(sidePanels.CHANGE_AGENT),
        withdrawEth: () => setSidePanel(sidePanels.TRANSFER_ETH_OUT),
        depositEth: () => setSidePanel(sidePanels.TRANSFER_ETH_IN)
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
