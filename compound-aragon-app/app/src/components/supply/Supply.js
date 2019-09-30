import React from "react"
import styled from "styled-components";
import CompoundTokenDetails from "./CompoundTokenDetails";
import Balances from "../balances/Balances";

const Supply = ({supplyState, handleTransfer, compactMode, isSyncing}) => {

    const {balances, compoundTokens, tokens} = supplyState

    const compoundToken = compoundTokens && compoundTokens.length > 0 ? compoundTokens[0] : {}

    return (
        <Container>
            <SpacedBlock>
                <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer} />
            </SpacedBlock>

            <CompoundTokenDetails compoundToken={compoundToken} tokens={tokens} isSyncing={isSyncing}/>
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
