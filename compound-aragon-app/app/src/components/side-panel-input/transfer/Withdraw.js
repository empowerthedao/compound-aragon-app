import React, {useState} from 'react'
import {Info, DropDown, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";

const WithdrawContainer = styled.div`
    display:flex;
    flex-direction: column;
`
const FieldStyled = styled(Field)`
    margin-bottom: 20px;
`
const ButtonStyled = styled(Button)`
    margin-top: 10px;
    margin-bottom: 30px;
`

const Deposit = ({appState, handleWithdraw}) => {

    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState(0)
    const [selectedCurrency, setSelectedCurrency] = useState(0)

    const {tokens} = appState

    const tokensAvailable = tokens.map(token => token.name)

    const getSelectedTokenAddress = () => tokens[selectedCurrency].address
    const getSelectedTokenDecimals = () => tokens[selectedCurrency].decimals

    return (
        <WithdrawContainer>

            <FieldStyled label="Recipient">
                <TextInput type="text" wide onChange={event => setRecipient(event.target.value)}/>
            </FieldStyled>

            <FieldStyled label="Amount">
                <TextInput type="number" wide onChange={event => setAmount(event.target.value)}/>
            </FieldStyled>

            <FieldStyled label="Token">
                <DropDown items={tokensAvailable} active={selectedCurrency} onChange={setSelectedCurrency} wide/>
            </FieldStyled>

            <ButtonStyled wide mode="strong"
                          onClick={() => handleWithdraw(getSelectedTokenAddress(), recipient, amount, getSelectedTokenDecimals())}>
                Submit Wtihdrawal
            </ButtonStyled>

            <Info.Action title="Deposit action">
                This action will withdraw the specified amount of Tokens or Ether from the Compound App's Agent.
            </Info.Action>
        </WithdrawContainer>
    )
}

export default Deposit