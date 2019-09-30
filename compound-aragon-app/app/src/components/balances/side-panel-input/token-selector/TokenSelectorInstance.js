import React from "react"
import styled from "styled-components"
import { GU } from "@aragon/ui"
import { ETHER_TOKEN_FAKE_ADDRESS } from "../../../../lib/shared-constants"
import { addressesEqual } from "../../../../lib/web3-utils"
import AddressBadge from "./AddressBadge"

class TokenSelectorInstance extends React.PureComponent {
    render() {
        const { address, name, symbol, showIcon = true } = this.props
        return (
            <Main>
                {showIcon ? (
                    <Icon src={`https://chasing-coins.com/coin/logo/${symbol}`}/>
                ) : (
                    <IconSpacer/>
                )}
                {symbol && <TokenSymbol>{symbol}</TokenSymbol>}
                {name && <TokenName>({name})</TokenName>}
                {!addressesEqual(address, ETHER_TOKEN_FAKE_ADDRESS) && (
                    <AddressBadge badgeOnly compact entity={address}/>
                )}
            </Main>
        )
    }
}

const Main = styled.div`
    display: flex;
    align-items: center;
    border-style: solid;
    border-width: small;
`

const Icon = styled.img.attrs({ alt: "", width: "16", height: "16" })`
    margin-right: ${1 * GU}px;
`

const IconSpacer = styled.div`
    width: ${3 * GU}px;
`

const TokenName = styled.span`
    max-width: 100px;
    white-space: nowrap;
    margin-right: ${1 * GU}px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const TokenSymbol = styled.span`
    margin-right: ${1 * GU}px;
`

export default TokenSelectorInstance
