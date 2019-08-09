import React from "react"
import Balances from "./Balances";
import styled from "styled-components";

const SpacedBlock = styled.div`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`

const Lend = ({lendState, handleTransfer}) => {

    const {balances} = lendState

    return (
        <>
            <SpacedBlock>
                <Balances balances={balances} handleTransfer={handleTransfer}/>
            </SpacedBlock>
        </>
    )

}

export default Lend
