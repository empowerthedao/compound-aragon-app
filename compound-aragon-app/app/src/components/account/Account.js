import React from 'react'
import styled from "styled-components";
import DetailButtonContainer from "../common/DetailButtonContainer";

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Account = ({appState, handleTransferEthOut}) => {

    const {agentEthBalance} = appState

    return (
        <AccountContainer>
            <div>
                <DetailButtonContainer label={"ETH Balance"}
                                       detail={agentEthBalance}
                                       buttonLabel={"Withdraw ETH"}
                                       buttonOnClick={handleTransferEthOut}/>
            </div>
        </AccountContainer>
    )
}

export default Account
