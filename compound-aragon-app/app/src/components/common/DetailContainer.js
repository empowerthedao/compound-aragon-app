import React from 'react'
import {Card, Text} from "@aragon/ui";
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
    width: auto;
`

const DetailContainer = ({label, detail}) => {
    return (
        <Container>
            <Text.Block size="normal">{label}</Text.Block>
            <DetailCard>
                <Text.Block size="normal">{detail}</Text.Block>
            </DetailCard>
        </Container>
    )
}

export default DetailContainer