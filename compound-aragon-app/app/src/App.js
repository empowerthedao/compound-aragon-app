import React from 'react'
import {TabBar, SidePanel, SyncIndicator, useViewport} from '@aragon/ui'
import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";
import TransferPanel from "./components/side-panel-input/transfer/TransferPanel";
import {useAppLogic} from "./hooks/app-logic";
import Supply from "./components/supply/Supply";
import CoinIcon from "./assets/coin.svg"
import SupplyPanel from "./components/side-panel-input/supply/TransferPanel";

function App({compactMode}) {

    const {
        isSyncing,
        supplyState,
        tokens,
        settings,
        actions,
        sidePanel,
        tabs
    } = useAppLogic()

    const selectedTabComponent = () => {
        switch (tabs.tabBarSelected.id) {
            case 'SUPPLY':
                return <Supply compactMode={compactMode} supplyState={supplyState}
                               handleTransfer={() => sidePanel.openPanelActions.transfer()}/>
            case 'SETTINGS':
                return <Settings settings={settings}
                                 handleNewAgent={() => sidePanel.openPanelActions.changeAgent()}/>
            default:
                return <div/>
        }
    }

    const currentSidePanel = () => {
        switch (sidePanel.currentSidePanel.id) {
            case 'CHANGE_AGENT':
                return <GenericInputPanel actionTitle={'Compound Action'}
                                          actionDescription={`This action will change the Agent which represents an Externally
                                        Owned Account (EOA) and is responsible for interacting with the Compound protocol.`}
                                          inputFieldList={[
                                              {id: 1, label: 'address', type: 'text'}]}
                                          submitLabel={'Change agent'}
                                          handleSubmit={actions.setAgentAddress}/>
            case 'TRANSFER':
                return <TransferPanel tokens={tokens}
                                      opened={sidePanel.opened}
                                      handleDeposit={actions.deposit}
                                      handleWithdraw={actions.withdraw}/>
            case 'SUPPLY':
                return <SupplyPanel handleSupply={actions.supply}
                                    handleRedeem={actions.redeem}
                                    opened={sidePanel.opened}/>
            default:
                return <div/>
        }
    }

    return (
        <div css="min-width: 320px">
            <SyncIndicator visible={isSyncing}/>

            <AppLayout title='Compound'
                       tabs={(<TabBar
                           items={tabs.names}
                           selected={tabs.selected}
                           onChange={tabs.selectTab}/>)}
                       smallViewPadding={30}
                       mainButton={tabs.tabBarSelected.id === 'SUPPLY' ? {
                           label: "Supply",
                           icon: <img src={CoinIcon} height="30px" alt="" />,
                           onClick: () => {sidePanel.openPanelActions.supply()}} : undefined }
            >

                {selectedTabComponent()}

            </AppLayout>

            <SidePanel
                title={sidePanel.currentSidePanel.title}
                opened={sidePanel.visible}
                onClose={sidePanel.requestClose}
                onTransitionEnd={sidePanel.endTransition}
            >
                {currentSidePanel()}
            </SidePanel>


        </div>
    )
}

export default () => {
    const {below} = useViewport()
    const compactMode = below('medium')

    return <App compactMode={compactMode}/>
}
