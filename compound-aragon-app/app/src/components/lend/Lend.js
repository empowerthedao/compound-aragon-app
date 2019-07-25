import React from "react"
import Balances from "./Balances";
import styled from "styled-components";

const SpacedBlock = styled.div`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`

const Lend = ({appState, handleTransfer}) => {

    const {balances} = appState

    return (
        <>
            <SpacedBlock>
                {balances.length > 0 && <Balances balances={balances} handleTransfer={handleTransfer}/>}
            </SpacedBlock>
        </>
    )

}

export default Lend
