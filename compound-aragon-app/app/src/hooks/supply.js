import {useAppState} from "@aragon/api-react";
import {formatTokenAmount} from "../lib/format-utils";
import {format} from 'date-fns'

// TODO: Move supply logic to here.
// TODO: Pick between compoundTransactions and compoundActivity
export function useSupplyState() {
    const {balances, compoundTokens, tokens, compoundTransactions} = useAppState()

    const underlyingTokenDecimals = (compoundTokenAddress) => compoundTokens
        .filter(compoundToken => compoundToken.tokenAddress === compoundTokenAddress)
        .map(compoundToken => compoundToken.underlyingToken)
        .map(underlyingTokenAddress => tokens
            .filter(token => token.address === underlyingTokenAddress)
            .map(token => ({symbol: token.symbol, decimals: token.decimals})))[0][0]

    const mappedMintTransactions = (compoundTransactions || [])
        .filter(transaction => transaction.type === "MINT")
        .map(transaction => {
            const formattedTokenAmount =
                formatTokenAmount(transaction.amount, true, underlyingTokenDecimals(transaction.compoundTokenAddress).decimals)
            return {...transaction, typeLabel: `Supply ${formattedTokenAmount} tokens`}
        })

    const mappedRedeemTransactions = (compoundTransactions || [])
        .filter(transaction => transaction.type === "REDEEM")
        .map(transaction => {
            const formattedTokenAmount =
                formatTokenAmount(transaction.amount, true, underlyingTokenDecimals(transaction.compoundTokenAddress).decimals)
            return {...transaction, typeLabel: `Redeem ${formattedTokenAmount} Tokens`}
        })

    const mappedCompoundActivity = [...mappedMintTransactions, ...mappedRedeemTransactions]
        .map(transaction => ({...transaction, timeLabel: format(transaction.time * 1000, 'dd/MM/yy')}))

    return {
        balances,
        compoundTokens,
        tokens,
        compoundActivity: mappedCompoundActivity
    }
}