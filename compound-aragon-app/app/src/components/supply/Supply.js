import React from "react"
import Balances from "./Balances";
import styled from "styled-components";
import SupplyDetails from "./SupplyDetails";

const Supply = ({supplyState, handleTransfer, compactMode}) => {

    const {balances, compoundTokens, tokens} = supplyState

    const compoundToken = compoundTokens && compoundTokens.length > 0 ? compoundTokens[0] : {}

    return (
        <Container>
            <SpacedBlock>
                <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer}/>
            </SpacedBlock>

            <SupplyDetails compoundToken={compoundToken} tokens={tokens} />
        </Container>
    )
}

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

export default Supply
