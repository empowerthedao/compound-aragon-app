import React, {useMemo, useState} from 'react'
import styled from 'styled-components'
import {Tabs} from '@aragon/ui'
import SupplyInput from "./SupplyInput";
import RedeemInput from "./RedeemInput";

const SupplyPanel = ({handleSupply, handleRedeem, opened, redeemPanelState}) => {

    const [screenIndex, setScreenIndex] = useState(0)

    useMemo(() => {
        if (!opened) {
            setScreenIndex(0)
        }
    }, [opened])

    return (
        <div>
            <TabBarWrapper>
                <Tabs
                    items={['Supply', 'Redeem']}
                    selected={screenIndex}
                    onChange={setScreenIndex}
                />
            </TabBarWrapper>

            {screenIndex === 0 && (
                <SupplyInput
                    handleSupply={handleSupply}
                />
            )}
            {screenIndex === 1 && (
                <RedeemInput
                    redeemPanelState={redeemPanelState}
                    handleRedeem={handleRedeem}
                />
            )}
        </div>
    )
}

const TabBarWrapper = styled.div`
  margin: 0 -30px 30px;
`

export default SupplyPanel
