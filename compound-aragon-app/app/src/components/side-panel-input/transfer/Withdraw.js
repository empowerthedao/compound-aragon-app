import React, {useState, useEffect} from 'react'
import {Info, DropDown, Field, TextInput, Button, Text, theme, unselectable} from '@aragon/ui'
import styled from "styled-components";

const Withdraw = ({appState, panelOpened, handleWithdraw}) => {

    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("")
    const [selectedCurrency, setSelectedCurrency] = useState(0)

    const {tokens} = appState

    const tokenSymbols = tokens.map(token => token.symbol)

    const getSelectedTokenAddress = () => tokens[selectedCurrency].address
    const getSelectedTokenDecimals = () => tokens[selectedCurrency].decimals

    const handleSubmit = (event) => {
        event.preventDefault()
        handleWithdraw(getSelectedTokenAddress(), recipient, amount, getSelectedTokenDecimals())
    }

    useEffect(() => {
        if (!panelOpened) {
            setRecipient("")
            setAmount("")
            setSelectedCurrency(0)
        }
    }, [panelOpened])

    return (
        <form onSubmit={handleSubmit}>
            <WithdrawContainer>

                <FieldStyled label="Recipient">
                    <TextInput type="text"
                               wide
                               required
                               value={recipient}
                               onChange={event => setRecipient(event.target.value)}/>
                </FieldStyled>

                <label>
                    <StyledTextBlock>
                        Amount
                        <StyledAsterisk/>
                    </StyledTextBlock>
                </label>
                <CombinedInput>
                    <TextInput
                        type="number"
                        value={amount}
                        onChange={event => setAmount(event.target.value)}
                        min={0}
                        step="any"
                        required
                        wide
                    />
                    <DropDown
                        items={tokenSymbols}
                        active={selectedCurrency}
                        value={selectedCurrency}
                        onChange={setSelectedCurrency}
                    />
                </CombinedInput>

                <ButtonStyled wide mode="strong"
                              type="submit">
                    Submit Withdrawal
                </ButtonStyled>

                <Info.Action title="Deposit action">
                    This action will withdraw the specified amount of Tokens or Ether from the Compound App's Agent.
                </Info.Action>
            </WithdrawContainer>
        </form>
    )
}

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

const CombinedInput = styled.div`
  display: flex;
  margin-bottom: 20px;
  input[type='text'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
  input[type='text'] + div > div:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`
const StyledTextBlock = styled(Text.Block).attrs({
    color: theme.textSecondary,
    smallcaps: true,
})`
  ${unselectable()};
  display: flex;
`
const StyledAsterisk = styled.span.attrs({
    children: '*',
    title: 'Required',
})`
  color: ${theme.accent};
  margin-left: auto;
  padding-top: 3px;
  font-size: 12px;
`

export default Withdraw