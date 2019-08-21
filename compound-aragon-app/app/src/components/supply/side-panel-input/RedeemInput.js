import React, {useState} from 'react'
import {Info, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";

// TODO: Add slider for specifying amount
const RedeemInput = ({handleRedeem}) => {

    const [amount, setAmount] = useState(0)

    const handleSubmit = (event) => {
        event.preventDefault()
        handleRedeem(amount)
    }

    return (
        <form onSubmit={handleSubmit}>
            <DepositContainer>

                <FieldStyled label="Amount">
                    <TextInput type="number"
                               wide
                               required
                               min={0}
                               step="any"
                               onChange={event => setAmount(event.target.value)}/>
                </FieldStyled>

                <ButtonStyled wide mode="strong"
                              type="submit">
                    Redeem Tokens
                </ButtonStyled>

                <Info.Action title="Compound action">
                    This action will redeem the specified amount of Tokens from the Compound App. They will no longer earn interest.
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

export default RedeemInput