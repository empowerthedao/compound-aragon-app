import React from "react"
import styled from "styled-components";
import {Text, TokenBadge, Box, theme, Split} from '@aragon/ui'
import {formatDecimals, formatTokenAmount} from "../../lib/format-utils";
import {fromDecimals, fromDecimals2, round, splitDecimalNumber} from "../../lib/math-utils";
import {useNetwork} from "@aragon/api-react";

const SUPPLY_RATE_DECIMALS = 18
const SUPPLY_BALANCE_DECIMALS = 6

const SupplyDetails = ({compoundToken, network, tokens}) => {

    const {tokenAddress, tokenName, tokenSymbol, underlyingToken, supplyRatePerBlock, balanceOfUnderlying} = compoundToken || {}

    const underlyingTokenDetails = tokens.find(token => token.address === underlyingToken)
    const {symbol: underlyingTokenSymbol, decimals: underlyingTokenDecimals} = underlyingTokenDetails || {}

    const aprValue = () => {
        const supplyRatePerYear = supplyRatePerBlock ? supplyRatePerBlock * 60 / 15 * 60 * 24 * 365 : 0 // Blocks/minute * minutes in hour * hours in day * days in year
        return round(fromDecimals(supplyRatePerYear.toString(), SUPPLY_RATE_DECIMALS))
    }

    const truncatedBalanceOfUnderlying =
        fromDecimals(balanceOfUnderlying ? balanceOfUnderlying : '', underlyingTokenDecimals,
            {truncate: true, truncateDecimals: SUPPLY_BALANCE_DECIMALS})

    return (
        <div css={'margin-top: 16px'}>
            <Split
                primary={
                    <Box>
                        <Wrap>
                            <Text>Supply Balance:</Text>
                            <Text
                                size="large"
                                weight="bold"
                                color={truncatedBalanceOfUnderlying > 0 ? String(theme.positive) : ''}
                            >
                                {truncatedBalanceOfUnderlying}{' '}
                                {underlyingTokenSymbol}{' '}
                            </Text>
                        </Wrap>
                    </Box>}
                secondary={
                    <>
                        <Box heading={"Compound Token"}>
                            {network && tokenSymbol && <TokenBadge
                                address={tokenAddress}
                                name={tokenName}
                                symbol={tokenSymbol}
                                networkType={network.type}
                            />}
                        </Box>
                        <Box css={'margin-top: 30px'} heading={"Yearly Rate"}>
                            <Text>{`${aprValue()}% APR`}</Text>
                        </Box>
                    </>}
            />
        </div>

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
