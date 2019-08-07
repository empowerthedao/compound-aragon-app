import React, {useState, useEffect} from "react"
import {Info, TextInput, Button, Field, SidePanel} from "@aragon/ui"
import styled from 'styled-components'

const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const InfoContainer = styled(Info.Action)`
    margin-bottom: 20px;
`

const GenericInputSidePanel = ({panelState, sidePanelTitle, actionTitle, actionDescription, inputFieldList, submitLabel, handleSubmit}) => {
    return (
        <SidePanel
            title={sidePanelTitle}
            opened={panelState.visible}
            onClose={panelState.requestClose}
            onTransitionEnd={panelState.endTransition}
        >
            <GenericInputPanel
                panelOpened={panelState.opened}
                actionTitle={actionTitle}
                actionDescription={actionDescription}
                inputFieldList={inputFieldList}
                submitLabel={submitLabel}
                handleSubmit={handleSubmit}/>
        </SidePanel>
    )
}

const InputField = ({id, inputFieldLabel, inputFieldType, inputFieldValue, onChange}) => {

    const handleChange = event => {
        const text = event.target.value;
        onChange(id, text);
    }

    return (
        <Field label={inputFieldLabel}>
            <TextInput type={inputFieldType} wide
                       value={inputFieldValue || ""}
                       onChange={handleChange}/>
        </Field>
    )
}

// inputFieldList must represent the arguments to handleSubmit and id's must be in the order of the arguments
const GenericInputPanel = ({panelOpened, actionTitle, actionDescription, inputFieldList, submitLabel, handleSubmit}) => {

    const [inputFieldData, setInputFieldData] = useState({})

    const handleFieldChange = (fieldId, value) => {
        setInputFieldData({...inputFieldData, [fieldId]: value})
    }

    useEffect(() => {
        if (!panelOpened) {
            setInputFieldData({})
        }
    }, [panelOpened])

    const inputFields = inputFieldList.map(inputField => (
            <InputField key={inputField.id}
                        id={inputField.id}
                        inputFieldLabel={inputField.label}
                        inputFieldType={inputField.type}
                        inputFieldValue={panelOpened ? inputFieldData[inputField.id] : ""}
                        onChange={handleFieldChange}
            />
        ));


    const sortedInputFieldData = () => Object.fromEntries(
        Object.entries(inputFieldData).sort((a, b) => a[0] - b[0])
    )

    return (
        <PanelContainer>

            <InfoContainer title={actionTitle}>
                {actionDescription}
            </InfoContainer>

            {inputFields}

            <Button mode="strong" onClick={() => {
                handleSubmit(...Object.values(sortedInputFieldData()))
            }}>
                {submitLabel}
            </Button>
        </PanelContainer>
    )
}

export default GenericInputSidePanel