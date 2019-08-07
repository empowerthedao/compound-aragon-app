import React, {useState} from 'react'
import {useCallback} from 'react'

export function useTabs() {
    const [tabBarSelected, setTabBarSelected] = useState(0)

    const requestOpen = useCallback(() => {
        setVisible(true)
        setOpened(false)
    }, [setVisible, setOpened])

    const endTransition = useCallback(
        opened => {
            if (opened) {
                setOpened(true)
            } else {
                setOpened(false)
            }
        },
        [setOpened]
    )

    const requestClose = useCallback(() => {
        setVisible(false)
        setOpened(false)
    }, [setVisible, setOpened])

    return { opened, visible, requestOpen, endTransition, requestClose }
}