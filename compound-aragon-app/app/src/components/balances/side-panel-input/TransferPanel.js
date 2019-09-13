import React, {useMemo, useState} from 'react'
import styled from 'styled-components'
import {Tabs} from '@aragon/ui'

import Deposit from './Deposit'
import Withdraw from './Withdraw'

const TransferPanel = ({handleDeposit, handleWithdraw, opened, transferPanelsState}) => {

    const [screenIndex, setScreenIndex] = useState(0)

    const {tokens, balances, checkConnectedAccountBalance} = transferPanelsState

    useMemo(() => {
        if (!opened) {
            setScreenIndex(0)
        }
    }, [opened])

    return (
        <div>
            <TabBarWrapper>
                <Tabs
                    items={['Deposit', 'Withdraw']}
                    selected={screenIndex}
                    onChange={setScreenIndex}
                />
            </TabBarWrapper>

            {screenIndex === 0 && (
                <Deposit
                    tokens={tokens}
                    handleDeposit={handleDeposit}
                    checkConnectedAccountBalance={checkConnectedAccountBalance}
                />
            )}
            {screenIndex === 1 && (
                <Withdraw
                    tokens={tokens}
                    balances={balances}
                    handleWithdraw={handleWithdraw}
                />
            )}
        </div>
    )
}

const TabBarWrapper = styled.div`
  margin: 0 -30px 30px;
`

export default TransferPanel
