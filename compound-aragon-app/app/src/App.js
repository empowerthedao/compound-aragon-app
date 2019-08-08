import React, {useState} from 'react'
import {useAppState} from '@aragon/api-react'
import {Main, TabBar, SidePanel, SyncIndicator} from '@aragon/ui'

import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import Lend from "./components/lend/Lend";
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";
import TransferPanel from "./components/side-panel-input/transfer/TransferPanel";
import {useAppLogic} from "./hooks/app-logic";

function App() {

    const appState = useAppState()

    const {isSyncing} = appState
    const [tabBarSelected, setTabBarSelected] = useState(0)

    const {
        actions,
        sidePanelState
    } = useAppLogic()

    const sidePanels = {
        TRANSFER: {
            name: 'TRANSFER',
            title: 'New Agent Transfer'
        },
        CHANGE_AGENT: {
            name: 'CHANGE_AGENT',
            title: 'Change the Agent'
        }
    }

    const tabs = [
        {
            tabName: "Lend",
            tabComponent: (
                <Lend appState={appState} handleTransfer={() => sidePanelState.requestOpen(sidePanels.TRANSFER)}/>
            ),
            smallViewPadding: 0
        },
        {
            tabName: 'Settings',
            tabComponent: (
                <Settings appState={appState}
                          handleNewAgent={() => sidePanelState.requestOpen(sidePanels.CHANGE_AGENT)}
                />
            ),
            smallViewPadding: 30
        }
    ]

    const tabsNames = tabs.map(tab => tab.tabName)
    const selectedTabComponent = tabs[tabBarSelected].tabComponent
    const getSmallViewPadding = () => tabs[tabBarSelected].smallViewPadding

    const currentSidePanel = () => {
        switch (sidePanelState.currentSidePanel.name) {
            case 'CHANGE_AGENT':
                return (<GenericInputPanel actionTitle={'Compound Action'}
                                           actionDescription={`This action will change the Agent which represents an Externally
                                        Owned Account (EOA) and is responsible for interacting with the Compound protocol.`}
                                           inputFieldList={[
                                               {id: 1, label: 'address', type: 'text'}]}
                                           submitLabel={'Change agent'}
                                           handleSubmit={actions.setAgentAddress}/>)
            case 'TRANSFER':
                return (<TransferPanel appState={appState}
                                       handleDeposit={actions.deposit}
                                       handleWithdraw={actions.withdraw}/>)
            default:
                return (<div/>)
        }
    }

    return (
        <div css="min-width: 320px">
            <Main>
                <SyncIndicator visible={isSyncing}/>
                <AppLayout title='Compound'
                           tabs={(<TabBar
                               items={tabsNames}
                               selected={tabBarSelected}
                               onChange={setTabBarSelected}/>)}
                           smallViewPadding={getSmallViewPadding()}>

                    {selectedTabComponent}

                </AppLayout>

                <SidePanel
                    title={sidePanelState.currentSidePanel.title}
                    opened={sidePanelState.visible}
                    onClose={sidePanelState.requestClose}
                    onTransitionEnd={sidePanelState.endTransition}
                >
                    {currentSidePanel()}
                </SidePanel>


            </Main>
        </div>
    )
}

export default App
