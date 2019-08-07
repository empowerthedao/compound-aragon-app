import React, {useState} from 'react'
import {useAppState} from '@aragon/api-react'
import {Main, TabBar, SyncIndicator} from '@aragon/ui'

import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import Lend from "./components/lend/Lend";
import GenericInputSidePanel from "./components/side-panel-input/GenericInputSidePanel";
import TransferSidePanel from "./components/side-panel-input/transfer/TransferSidePanel";
import {useAppLogic} from "./hooks/app-logic";

function App() {

    const appState = useAppState()

    const [tabBarSelected, setTabBarSelected] = useState(0)

    const {
        isSyncing,
        actions,
        transferSidePanelState,
        changeAgentSidePanelState
    } = useAppLogic()

    const tabs = [
        {
            tabName: "Lend",
            tabComponent: (
                <Lend appState={appState} handleTransfer={() => transferSidePanelState.requestOpen()}/>
            ),
            smallViewPadding: 0
        },
        {
            tabName: 'Settings',
            tabComponent: (
                <Settings appState={appState}
                          handleNewAgent={() => changeAgentSidePanelState.requestOpen()}
                />
            ),
            smallViewPadding: 30
        }
    ]

    const tabsNames = tabs.map(tab => tab.tabName)
    const selectedTabComponent = tabs[tabBarSelected].tabComponent
    const getSmallViewPadding = () => tabs[tabBarSelected].smallViewPadding

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

                <TransferSidePanel appState={appState}
                                   panelState={transferSidePanelState}
                                   onDeposit={actions.deposit}
                                   onWithdraw={actions.withdraw}
                />

                <GenericInputSidePanel panelState={changeAgentSidePanelState}
                                       sidePanelTitle={'Change the Agent'}
                                       actionTitle={'Compound Action'}
                                       actionDescription={`This action will change the Agent which represents an Externally
                                        Owned Account (EOA) and is responsible for interacting with the Compound protocol.`}
                                       inputFieldList={[
                                           {id: 1, label: 'address', type: 'text'}]}
                                       submitLabel={'Change agent'}
                                       handleSubmit={actions.setAgentAddress}/>


            </Main>
        </div>
    )
}

export default App
