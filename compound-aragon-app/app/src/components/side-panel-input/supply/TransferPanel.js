import React, {useMemo, useState} from 'react'
import styled from 'styled-components'
import {TabBar} from '@aragon/ui'
import SupplyInput from "./SupplyInput";
import RedeemInput from "./RedeemInput";

const SupplyPanel = ({handleSupply, handleRedeem, opened}) => {

    const [screenIndex, setScreenIndex] = useState(0)

    useMemo(() => {
        if (!opened) {
            setScreenIndex(0)
        }
    }, [opened])

    return (
        <div>
            <TabBarWrapper>
                <TabBar
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
