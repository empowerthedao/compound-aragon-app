import React from "react"
import styled from "styled-components";
import {Text, TokenBadge, Box, theme, Split} from '@aragon/ui'
import {formatTokenAmount} from "../../lib/format-utils";
import {fromDecimals, round} from "../../lib/math-utils";
import {useNetwork} from "@aragon/api-react";

const SupplyDetails = ({compoundToken, network, tokens}) => {

    const {tokenAddress, tokenName, tokenSymbol, underlyingToken, supplyRatePerBlock, balanceOfUnderlying} = compoundToken || {}

    const yearlySupplyEstimate = () => supplyRatePerBlock ? supplyRatePerBlock * 60 / 15 * 60 * 24 * 365 : 0 // Blocks/minute * minutes in hour * hours in day * days in year

    const aprValue = round(fromDecimals(yearlySupplyEstimate().toString(), 18))

    const underlyingTokenDetails = tokens.find(token => token.address === underlyingToken)

    const {symbol: underlyingTokenSymbol, decimals: underlyingTokenDecimals} = underlyingTokenDetails || {}

    return (
        <>
            <Split
                primary={
                    <>
                        <Box css={'margin-top: 30px'}>
                            <Wrap>
                                <Text>Supply Balance:</Text>
                                <Text
                                    size="large"
                                    weight="bold"
                                    color={balanceOfUnderlying > 0 ? String(theme.positive) : ''}
                                >
                                    {formatTokenAmount(balanceOfUnderlying, false, underlyingTokenDecimals, false, {rounding: underlyingTokenDecimals})}{' '}
                                    {underlyingTokenSymbol}{' '}
                                </Text>
                            </Wrap>
                        </Box>
                    </>}
                secondary={
                    <>
                        <Box css={'margin-top: 30px'} heading={"Compound Token"}>
                            {network && tokenSymbol && <TokenBadge
                                address={tokenAddress}
                                name={tokenName}
                                symbol={tokenSymbol}
                                networkType={network.type}
                            />}
                        </Box>
                        <Box css={'margin-top: 30px'} heading={"Yearly Rate"}>
                            <Text>{`${aprValue}% APR`}</Text>
                        </Box>
                    </>}
            />
        </>

    )
}

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
`

export default props => {
    const network = useNetwork()
    return <SupplyDetails network={network} {...props} />
}
