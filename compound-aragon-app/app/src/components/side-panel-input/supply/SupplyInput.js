import React, {useState} from 'react'
import {Info, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";

const SupplyInput = ({handleSupply}) => {

    const [amount, setAmount] = useState(0)

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSupply(amount)
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
                    Supply Tokens
                </ButtonStyled>

                <Info.Action title="Compound action">
                    This action will supply the specified amount of Tokens to the Compound App. It will earn interest over time.
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

export default SupplyInput