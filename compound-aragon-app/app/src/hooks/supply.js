import {useAppState} from "@aragon/api-react";
import {formatTokenAmount} from "../lib/format-utils";
import {format} from 'date-fns'

// TODO: Move more supply logic to here.
// TODO: Pick between compoundTransactions and compoundActivity
export function useSupplyState() {
    const {balances, compoundTokens, tokens} = useAppState()

    console.log(compoundTokens)

    const {compoundTransactions} = (compoundTokens || [])[0] || {}

    const underlyingTokenDetails = (compoundTokenAddress) => compoundTokens
        .filter(compoundToken => compoundToken.tokenAddress === compoundTokenAddress)
        .map(compoundToken => compoundToken.underlyingToken)
        .map(underlyingTokenAddress => tokens
            .filter(token => token.address === underlyingTokenAddress)
            .map(token => ({symbol: token.symbol, decimals: token.decimals})))[0][0]

    const mappedMintTransactions = (compoundTransactions || [])
        .filter(transaction => transaction.type === "MINT")
        .map(transaction => {
            const tokenDetails = underlyingTokenDetails(transaction.compoundTokenAddress)
            const formattedTokenAmount =
                formatTokenAmount(transaction.transferAmount, true, tokenDetails.decimals)
            return {...transaction, typeLabel: `Supply ${formattedTokenAmount} ${tokenDetails.symbol}`}
        })

    const mappedRedeemTransactions = (compoundTransactions || [])
        .filter(transaction => transaction.type === "REDEEM")
        .map(transaction => {
            const tokenDetails = underlyingTokenDetails(transaction.compoundTokenAddress)
            const formattedTokenAmount =
                formatTokenAmount(transaction.transferAmount, true, tokenDetails.decimals)
            return {...transaction, typeLabel: `Redeem ${formattedTokenAmount} ${tokenDetails.symbol}`}
        })

    const mappedCompoundTransactions = [...mappedMintTransactions, ...mappedRedeemTransactions]
        .sort((x, y) => y.timestamp - x.timestamp)
        .map(transaction => ({...transaction, timeLabel: format(transaction.timestamp * 1000, 'MMMM do, h:mma')}))

    return {
        balances,
        compoundTokens,
        tokens,
        compoundActivity: mappedCompoundTransactions
    }
}