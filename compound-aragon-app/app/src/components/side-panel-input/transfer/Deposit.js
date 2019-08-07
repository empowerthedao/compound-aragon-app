import React, {useState, useEffect} from 'react'
import {Info, DropDown, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";

const Deposit = ({panelOpened, appState, handleDeposit}) => {

    const {tokens} = appState

    const [tokenSelected, setTokenSelected] = useState(0)
    const [customToken, setCustomToken] = useState("")
    const [amount, setAmount] = useState("")

    const tokensAvailable = tokens.map(token => token.name)
    tokensAvailable.push("Other...")

    const showCustomToken = tokenSelected === tokensAvailable.length - 1

    const getSelectedTokenAddress = () => showCustomToken ? customToken : tokens[tokenSelected].address
    const getSelectedTokenDecimals = () => showCustomToken ? -1 : tokens[tokenSelected].decimals

    const handleSubmit = (event) => {
        event.preventDefault()
        handleDeposit(getSelectedTokenAddress(), amount, getSelectedTokenDecimals())
    }

    useEffect(() => {
        if (!panelOpened) {
            setTokenSelected(0)
            setCustomToken("")
            setAmount("")
        }
    }, [panelOpened])

    return (
        <form onSubmit={handleSubmit}>
            <DepositContainer>

                <FieldStyled label="Token">
                    <DropDown items={tokensAvailable} value={tokenSelected} required active={tokenSelected} onChange={setTokenSelected}
                              wide/>
                </FieldStyled>

                {showCustomToken && (
                    <FieldStyled label="Token Address">
                        <TextInput type="text"
                                   wide
                                   value={customToken}
                                   required={showCustomToken}
                                   onChange={event => setCustomToken(event.target.value)}/>
                    </FieldStyled>
                )}

                <FieldStyled label="Amount">
                    <TextInput type="number"
                               wide
                               required
                               min={0}
                               step="any"
                               value={amount}
                               onChange={event => setAmount(event.target.value)}/>
                </FieldStyled>

                <ButtonStyled wide mode="strong"
                              type="submit">
                    Submit Deposit
                </ButtonStyled>

                <Info.Action title="Deposit action">
                    This action will deposit the specified amount of Tokens or Ether to the Compound App's Agent.
                </Info.Action>
            </DepositContainer>
        </form>
    )
}

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

export default Deposit