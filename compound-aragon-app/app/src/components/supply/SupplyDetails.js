import React from 'react'
import {fromDecimals, round} from "../../lib/math-utils";
import {Text, TokenBadge, Box} from '@aragon/ui'


const SUPPLY_RATE_DECIMALS = 18

const SupplyDetails = ({compoundToken, network}) => {

    const {tokenAddress, tokenName, tokenSymbol, supplyRatePerBlock, balanceOfUnderlying} = compoundToken || {}

    const aprValue = () => {
        const supplyRatePerYear = supplyRatePerBlock ? supplyRatePerBlock * 60 / 15 * 60 * 24 * 365 : 0 // Blocks/minute * minutes in hour * hours in day * days in year
        return round(fromDecimals(supplyRatePerYear.toString(), SUPPLY_RATE_DECIMALS), 3)
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

            <Box css={'margin-top: 30px'} heading={"Block Rate"}>
                <Text>{supplyRatePerBlock}</Text>
            </Box>

            <Box css={'margin-top: 30px'} heading={"Supply Balance full"}>
                <Text>{balanceOfUnderlying}</Text>
            </Box>
        </>)
}

export default SupplyDetails
