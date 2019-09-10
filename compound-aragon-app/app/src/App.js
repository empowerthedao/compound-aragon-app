import React from 'react'
import {
    SidePanel,
    SyncIndicator,
    useViewport,
    Button,
    Header,
    Tabs
} from '@aragon/ui'
import Settings from "./components/settings/Settings"
import GenericInputPanel from "./components/GenericInputPanel";
import TransferPanel from "./components/balances/side-panel-input/TransferPanel";
import {useAppLogic} from "./hooks/app-logic";
import Supply from "./components/supply/Supply";
import SupplyIcon from "./assets/supply-icon.svg"
import SupplyPanel from "./components/supply/side-panel-input/TransferPanel";
import PropTypes from 'prop-types';

// TODO: Add link to Compound website?
function App({compactMode}) {

    const {
        isSyncing,
        supplyState,
        tokens,
        settings,
        actions,
        sidePanel,
        tabs,
        redeemPanelState,
        depositPanelState
    } = useAppLogic()

    const selectedTabComponent = () => {
        switch (tabs.tabBarSelected.id) {
            case 'SUPPLY':
                return <Supply compactMode={compactMode}
                               supplyState={supplyState}
                               handleTransfer={() => sidePanel.openPanelActions.transfer()}/>
            case 'SETTINGS':
                return <Settings settings={settings}
                                 handleNewAgent={() => sidePanel.openPanelActions.changeAgent()}
                                 compactMode={compactMode}/>
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
                                      handleWithdraw={actions.withdraw}
                                      depositPanelState={depositPanelState}/>
            case 'SUPPLY':
                return <SupplyPanel handleSupply={actions.supply}
                                    handleRedeem={actions.redeem}
                                    redeemPanelState={redeemPanelState}
                                    opened={sidePanel.opened}/>
            default:
                return <div/>
        }
    }

    return (
        <div css="min-width: 320px">
            <SyncIndicator visible={isSyncing}/>

            <Header
                primary="Compound"
                secondary={
                    tabs.tabBarSelected.id === 'SUPPLY' &&
                    <Button
                        mode="strong"
                        onClick={() => sidePanel.openPanelActions.supply()}
                        css={`${compactMode && `
                            min-width: 40px;
                            padding: 0;
                            `}
                        `}
                    >
                        {compactMode ? <img src={SupplyIcon} height="30px" alt=""/> : 'Supply / Redeem'}
                    </Button>
                }
            />

            <Tabs
                items={tabs.names}
                selected={tabs.selected}
                onChange={tabs.selectTab}/>

            {selectedTabComponent()}

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

App.propTypes = {
    api: PropTypes.object,
    compactMode: PropTypes.bool
}