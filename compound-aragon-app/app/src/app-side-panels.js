import React, {useState} from 'react'
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";
import {setAgent} from "./web3/CompoundAppContract";

const useSidePanelActions = (api, closeSidePanel) => {

    const setAgentAddress = (address) => {
        closeSidePanel()
        setAgent(api, address)
    }

    return {
        setAgentAddress
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
        }
    }

    const openSidePanelActions = {
        changeAgent: () => setSidePanel(sidePanels.CHANGE_AGENT)
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
