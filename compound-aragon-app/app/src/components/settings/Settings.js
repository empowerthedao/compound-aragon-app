import React from "react"
import styled from 'styled-components'
import Option from "./Option";
import {Button, Text, Card} from "@aragon/ui";

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    max-width: 400px;

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

const Settings = ({handleNewAgent, appState}) => {
    const {appAddress, agentAddress} = appState

    return (
        <SettingsContainer>

            <Option name="Agent Address" text="The contract that represents an EOA and acts on behalf of the Compound app. Funds can be sent to this address.">
                <DetailCard>
                    <Text.Block size="normal">{agentAddress}</Text.Block>
                </DetailCard>

                <ButtonContainer>
                    <Button mode="outline" onClick={() => handleNewAgent()}>
                        Change Agent
                    </Button>
                </ButtonContainer>
            </Option>

            <Option name="Compound App Address" text="The contract address of this app. Do not send funds to this address.">
                <DetailCard>
                    <Text.Block size="normal">{appAddress}</Text.Block>
                </DetailCard>
            </Option>

        </SettingsContainer>
    )
}

export default Settings