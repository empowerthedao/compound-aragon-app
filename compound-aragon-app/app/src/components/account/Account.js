import React from 'react'
import styled from "styled-components";
import DetailTwoButtonContainer from "../common/DetailTwoButtonContainer";

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Account = ({appState, handleTransferEthOut, handleDepositEth}) => {

    const {agentEthBalance} = appState

    return (
        <AccountContainer>
            <div>
                <DetailTwoButtonContainer label={"Agents ETH Balance"}
                                          detail={agentEthBalance}
                                          leftButtonLabel={"Withdraw ETH"}
                                          leftButtonOnClick={handleTransferEthOut}
                                          rightButtonLabel={"Deposit ETH"}
                                          rightButtonOnClick={handleDepositEth}/>
            </div>
        </AccountContainer>
    )
}

export default Account
