import {Box, DataView, Text, theme, useTheme} from "@aragon/ui";
import React from "react";
import {fromDecimals} from "../../lib/math-utils";
import styled from "styled-components";

const SUPPLY_BALANCE_DECIMALS = 6
const PAGINATION = 10

// TODO: Use RenderEntry on DataView to process some stuff.
const SupplyActivity = ({compoundToken, tokens, compoundActivity}) => {

    const {underlyingToken, balanceOfUnderlying} = compoundToken || {}

    const underlyingTokenDetails = tokens.find(token => token.address === underlyingToken)
    const {symbol: underlyingTokenSymbol, decimals: underlyingTokenDecimals} = underlyingTokenDetails || {}

    const truncatedBalanceOfUnderlying =
        fromDecimals(balanceOfUnderlying ? balanceOfUnderlying : '', underlyingTokenDecimals,
            {truncate: true, truncateDecimals: SUPPLY_BALANCE_DECIMALS})

    return (
        <>
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
            </Box>

            {(compoundActivity || []).length > 0 ?
                <DataView
                    fields={['Transaction', 'Time']}
                    entries={compoundActivity.map(transaction => [transaction.typeLabel, transaction.timeLabel])}
                    renderEntry={([type, time]) => [
                        <Text>
                            {type}
                        </Text>,
                        <Text>
                            {time}
                        </Text>,
                    ]}
                    mode="table"
                    entriesPerPage={PAGINATION}
                /> :
                <Box style={{textAlign: 'center'}}>
                    <Text>No activity</Text>
                </Box>}

        </>
    )
}

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
`

export default SupplyActivity