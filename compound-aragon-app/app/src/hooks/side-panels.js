import React, {useState} from 'react'
import {useCallback} from 'react'

export function useSidePanels() {
    const [currentSidePanel, setCurrentSidePanel] = useState({title: ""})
    const [visible, setVisible] = useState(false)
    const [opened, setOpened] = useState(false)

    const requestOpen = useCallback((sidePanel) => {
        setCurrentSidePanel(sidePanel)
        setVisible(true)
        setOpened(false)
    }, [setVisible, setOpened])

    const endTransition = useCallback(
        opened => {
            if (opened) {
                setOpened(true)
            } else {
                setOpened(false)
                setCurrentSidePanel({title: ""})
            }
        },
        [setOpened]
    )

    const requestClose = useCallback(() => {
        setVisible(false)
        setOpened(false)
    }, [setVisible, setOpened])

    return { currentSidePanel, opened, visible, requestOpen, endTransition, requestClose }
}

