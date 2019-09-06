import React, {useState} from 'react'
import {Info, Field, TextInput, Button, DropDown, useTheme, unselectable} from '@aragon/ui'
import styled from "styled-components";

const RedeemInput = ({handleRedeem, redeemPanelState}) => {

    const {getMaxRedeemable} = redeemPanelState

    const [amount, setAmount] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        handleRedeem(amount)
    }

    const handleSetMax = () => {
        getMaxRedeemable(setAmount)
    }

    return (
        <form onSubmit={handleSubmit}>
            <DepositContainer>

                <label>
                    <StyledTextBlock>
                        Amount
                        <StyledAsterisk/>
                    </StyledTextBlock>
                </label>
                <CombinedInput>
                    <TextInput
                        type="number"
                        onChange={event => setAmount(event.target.value)}
                        min={0}
                        step="any"
                        required
                        wide
                        value={amount}
                    />

                    <Button css={`margin-left: 16px;`} onClick={() => handleSetMax()}>Set Max</Button>
                </CombinedInput>


                <ButtonStyled wide mode="strong"
                              type="submit">
                    Redeem Tokens
                </ButtonStyled>

                <Info.Action title="Compound action">
                    This action will redeem the specified amount of Tokens from the Compound App. They will no longer
                    earn interest.
                </Info.Action>
            </DepositContainer>
        </form>
    )
}

const DepositContainer = styled.div`
    display:flex;
    flex-direction: column;
`
const ButtonStyled = styled(Button)`
    margin-top: 10px;
    margin-bottom: 30px;
`

const CombinedInput = styled.div`
  display: flex;
  margin-top: 3px;
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

const StyledTextBlock = props => {
    const theme = useTheme()
    return (
        <div
            css={`
        color: ${theme.surfaceContentSecondary};
        display: flex;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 12px;
        line-height: 1.5;
        ${unselectable()};
      `}
            {...props}
        />
    )
}

const StyledAsterisk = props => {
    const theme = useTheme()
    return (
        <span
            title="Required"
            css={`
        color: ${theme.accent};
        margin-left: 3px;
        font-size: 12px;
      `}
            {...props}
        >
      *
    </span>
    )
}

export default RedeemInput