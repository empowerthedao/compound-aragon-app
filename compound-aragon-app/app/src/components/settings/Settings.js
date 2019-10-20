import React from "react"
import styled from 'styled-components'
import {Button, IdentityBadge, Box, Text, Info} from "@aragon/ui";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const Settings = ({handleNewAgent, settings, compactMode}) => {
    let {agentAddress} = settings

    return (
        <div css={`display: flex;
                flex-direction: ${compactMode ? "column" : "row"};
                justify-content: space-between;
                align-items: flex-start;
                margin: 0px -10px;
                flex-wrap: wrap;
               `}
        >

            <div css={`
            flex-basis: 0; 
            flex-grow: 1; 
            margin: 0px 10px; 
            margin-bottom: 20px;
            `}>
                <Box heading={"Agent Address"}>

                    <div css={`display: flex; flex-direction: column;`}>
                        <Text>
                            The contract that represents an EOA (Externally Owned Account) and acts on behalf of the
                            Compound app.
                        </Text>

                        <MarginTopContainer>
                            <IdentityBadge
                                entity={agentAddress || ZERO_ADDRESS}
                                shorten={compactMode}
                            />
                        </MarginTopContainer>

                        <MarginTopContainer>
                            <Info>
                                <strong>
                                    Only send ERC20 tokens to this address via the transfer process provided.
                                    <br/>
                                    <br/>
                                    All Compound supplied tokens must be withdrawn before changing.
                                </strong>
                            </Info>
                        </MarginTopContainer>

                        <ButtonContainer>
                            <Button onClick={() => handleNewAgent()}>
                                Change Agent
                            </Button>
                        </ButtonContainer>
                    </div>
                </Box>
            </div>

        </div>
    )
}

const MarginTopContainer = styled.div`
    margin-top: 20px;
`

const ButtonContainer = styled.div`
    margin-top: 25px;
    display: flex;
`

export default Settings