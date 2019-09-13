import {Box, DataView, Text, theme} from "@aragon/ui";
import React from "react";
import {fromDecimals} from "../../lib/math-utils";
import styled from "styled-components";

const SUPPLY_BALANCE_DECIMALS = 6
const PAGINATION = 5

const SupplyActivity = ({compoundToken, tokens}) => {

    const {underlyingToken, balanceOfUnderlying, compoundTransactions} = compoundToken || {}

    const underlyingTokenDetails = tokens.find(token => token.address === underlyingToken)
    const {symbol: underlyingTokenSymbol, decimals: underlyingTokenDecimals} = underlyingTokenDetails || {}

    const truncatedBalanceOfUnderlying =
        fromDecimals(balanceOfUnderlying ? balanceOfUnderlying : '', underlyingTokenDecimals,
            {truncate: true, truncateDecimals: SUPPLY_BALANCE_DECIMALS})

    const dataViewEntries = (compoundTransactions || []).map(transaction =>
        [transaction.typeLabelPrefix, transaction.typeLabelSuffix, transaction.timeLabel])

    return (
        <>
            <Box padding={0}>
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

            {(compoundTransactions || []).length > 0 ?
                <DataView
                    fields={['Transaction', 'Time']}
                    entries={dataViewEntries}
                    renderEntry={([prefix, suffix, time]) => [
                        <div>
                            <Text>
                                {prefix}{' '}
                            </Text>
                            <Text>
                                {suffix}
                            </Text>
                        </div>,
                        <Text>
                            {time}
                        </Text>,
                    ]}
                    mode="table"
                    entriesPerPage={PAGINATION}
                /> :
                <Box style={{textAlign: 'center'}}>
                    <Text>No transactions</Text>
                </Box>}

        </>
    )
}

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`

export default SupplyActivity