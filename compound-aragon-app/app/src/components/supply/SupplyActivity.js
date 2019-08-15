import {Box, DataView, Text, theme, useTheme} from "@aragon/ui";
import React from "react";
import {fromDecimals} from "../../lib/math-utils";
import styled from "styled-components";

const SUPPLY_BALANCE_DECIMALS = 6

const SupplyActivity = ({compoundToken, tokens}) => {

    const {underlyingToken, balanceOfUnderlying, activity} = compoundToken || {}

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

            {/*{(activity || []).length > 0 ?*/}
            {/*    <DataView*/}
            {/*        fields={['Action', 'Time']}*/}
            {/*        // entries={locked.map(l => [l.lockAmount, l.unlockTime])}*/}
            {/*        // renderEntry={([amount, unlockTime]) => [*/}
            {/*        //     <Text>*/}
            {/*        //         {`${formatTokenAmount(*/}
            {/*        //             amount,*/}
            {/*        //             false,*/}
            {/*        //             tokenDecimals*/}
            {/*        //         )} ${tokenSymbol}`}*/}
            {/*        //     </Text>,*/}
            {/*        //     renderUnlockTime(unlockTime),*/}
            {/*        // ]}*/}
            {/*        // mode="table"*/}
            {/*        // entriesPerPage={PAGINATION}*/}
            {/*        // onSelectEntries={selected => console.log('selected', selected)}*/}
            {/*    /> :*/}
            {/*    <Box style={{textAlign: 'center'}}>*/}
            {/*        <Text>No activity</Text>*/}
            {/*    </Box>}*/}

        </>
    )
}

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
`

export default SupplyActivity