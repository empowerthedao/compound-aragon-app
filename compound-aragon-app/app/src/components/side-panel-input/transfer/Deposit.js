import React, {useState} from 'react'
import {Info, DropDown, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";

const DepositContainer = styled.div`
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

const Deposit = ({appState, handleDeposit}) => {

    const [tokenSelected, setTokenSelected] = useState(0)
    const [amount, setAmount] = useState(0)

    const {tokens} = appState

    const tokensAvailable = tokens.map(token => token.name)

    const getSelectedTokenAddress = () => tokens[tokenSelected].address

    const getSelectedTokenDecimals = () => tokens[tokenSelected].decimals

    return (
        <DepositContainer>

            <FieldStyled label="Token">
                <DropDown items={tokensAvailable} active={tokenSelected} onChange={setTokenSelected} wide/>
            </FieldStyled>

            <FieldStyled label="Amount">
                <TextInput type="number" wide onChange={event => setAmount(event.target.value)}/>
            </FieldStyled>

            <ButtonStyled wide mode="strong"
                          onClick={() => handleDeposit(getSelectedTokenAddress(), amount, getSelectedTokenDecimals())}>
                Submit Deposit
            </ButtonStyled>

            <Info.Action title="Deposit action">
                This action will deposit the specified amount of Tokens or Ether to the Compound App's Agent.
            </Info.Action>
        </DepositContainer>
    )
}

export default Deposit