import React from "react"
import styled from 'styled-components'
import DetailContainer from "../common/DetailContainer";
import DetailButtonContainer from "../common/DetailButtonContainer";

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`

const Settings = ({handleNewAgent, appState}) => {
    const {appAddress, agentAddress} = appState

    return (
        <SettingsContainer>
            <div>
                <DetailButtonContainer label="Agent Address"
                                       detail={agentAddress}
                                       buttonLabel="Change Agent"
                                       buttonOnClick={handleNewAgent}/>

                <DetailContainer label="Aragon App Address"
                                 detail={appAddress}/>
            </div>

        </SettingsContainer>
    )
}

export default Settings