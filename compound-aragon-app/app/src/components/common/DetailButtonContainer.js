import React from 'react'
import {Button, Card, Text} from "@aragon/ui";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const DetailCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 15px;
    width: auto;
`
const ButtonContainer = styled.div`
    display: flex;
`

const DetailButtonContainer = ({label, detail, buttonLabel, buttonOnClick}) => {
    return (
        <Container>
            <Text.Block size="normal">{label}</Text.Block>
            <DetailCard>
                <Text.Block size="normal">{detail}</Text.Block>
            </DetailCard>

            <ButtonContainer>
                <Button mode="strong" onClick={() => buttonOnClick()}>
                    {buttonLabel}
                </Button>
            </ButtonContainer>
        </Container>
    )
}

export default DetailButtonContainer