import React from 'react'
import {fromDecimals, round} from "../../lib/math-utils";
import {Text, TokenBadge, Box, theme} from '@aragon/ui'

const SUPPLY_RATE_DECIMALS = 16
const ESTIMATED_BLOCK_TIME = 15
const LIFETIME_INTEREST_DECIMALS = 6

const SupplyDetails = ({compoundToken, network, tokens}) => {

    const {
        tokenAddress,
        tokenName,
        tokenSymbol,
        supplyRatePerBlock,
        lifetimeInterestEarned,
        underlyingToken
    } = compoundToken || {}

    const {totalInterestOfUnderlying} = lifetimeInterestEarned || {}
    const underlyingTokenDetails = tokens.find(token => token.address === underlyingToken)
    const {symbol: underlyingTokenSymbol, decimals: underlyingTokenDecimals} = underlyingTokenDetails || {}

    const aprValue = () => {
        // Calculation for yearly rate is blocks/minute * minutes in hour * hours in day * days in year
        const supplyRatePerYear = supplyRatePerBlock ? supplyRatePerBlock * 60 / ESTIMATED_BLOCK_TIME * 60 * 24 * 365 : 0
        return round(fromDecimals(supplyRatePerYear.toString(), SUPPLY_RATE_DECIMALS), 3)
    }

    const formattedTokenAmount = () => {
        const formattedAmount =
            fromDecimals(totalInterestOfUnderlying ? totalInterestOfUnderlying : '', underlyingTokenDecimals,
                {truncate: true, truncateDecimals: LIFETIME_INTEREST_DECIMALS})
        return !totalInterestOfUnderlying || totalInterestOfUnderlying < 0 ? "0" : formattedAmount
    }

    return (
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

            <Box css={'margin-top: 30px'} heading={"Lifetime Interest Earned"}>
                <Text color={totalInterestOfUnderlying > 0 ? String(theme.positive) : ''}
                      weight="bold">
                    {`${formattedTokenAmount()} ${underlyingTokenSymbol || ""}`}
                </Text>
            </Box>
        </>)
}

export default SupplyDetails
