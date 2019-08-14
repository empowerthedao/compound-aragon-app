import React from "react"
import Balances from "./Balances";
import styled from "styled-components";
import {Text, TokenBadge, Box, theme} from '@aragon/ui'

// TODO: Get network type.
const Supply = ({supplyState, handleTransfer, compactMode}) => {

    const {balances, compoundTokens, network} = supplyState

    const {compoundTokenAddress, name, symbol, supplyRatePerBlock, balanceOfUnderlying} =
        compoundTokens && compoundTokens.length > 0 ? compoundTokens[0] : {}

    return (
        <Container>
            <SpacedBlock>
                <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer}/>
            </SpacedBlock>

            <SupplyBox heading={"Supply tokens"}>
                <ul>
                    <InfoRow>
                        <Text>Supply Rate</Text>
                        <Text>{supplyRatePerBlock}</Text>
                    </InfoRow>
                    <InfoRow>
                        <Text>Supply Balance</Text>
                        <Text>{balanceOfUnderlying}</Text>
                    </InfoRow>
                    <InfoRow>
                        <Text>Token</Text>
                        {network && symbol && <TokenBadge
                            address={compoundTokenAddress}
                            name={name}
                            symbol={symbol}
                            networkType={network.type}
                        />}
                    </InfoRow>
                </ul>
            </SupplyBox>
        </Container>

    )

}

const SupplyBox = styled(Box)`
    margin-top: 30px;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const SpacedBlock = styled.div`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`

const InfoRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  list-style: none;

  > span:nth-child(1) {
    font-weight: 400;
    color: ${theme.textSecondary};
  }
`

export default Supply
