import {useAppState} from "@aragon/api-react";
import {formatTokenAmount} from "../lib/format-utils";
import {format} from 'date-fns'
import BN from 'bn.js'

// TODO: Move more supply logic to here.
// TODO: useMemo/useCallback
export function useSupplyState() {
    const {balances, compoundTokens, tokens} = useAppState()

    const underlyingTokenDetails = (compoundTokenAddress) => compoundTokens
        .filter(compoundToken => compoundToken.tokenAddress === compoundTokenAddress)
        .map(compoundToken => compoundToken.underlyingToken)
        .map(underlyingTokenAddress => tokens
            .filter(token => token.address === underlyingTokenAddress)
            .map(token => ({symbol: token.symbol, decimals: token.decimals}))[0])[0]

    const mappedCompoundActions = (compoundTransactions, compoundTokenAddress, type, typeLabel) => {
        return (compoundTransactions || [])
            .filter(transaction => transaction.type === type)
            .map(transaction => {
                const tokenDetails = underlyingTokenDetails(compoundTokenAddress)
                const formattedTokenAmount =
                    formatTokenAmount(transaction.transferAmount, true, tokenDetails.decimals)
                return {...transaction, typeLabel: `${typeLabel} ${formattedTokenAmount} ${tokenDetails.symbol}`}
            })
    }

    const mapCompoundTransactions = (compoundToken) => {
        const {compoundTransactions, tokenAddress: compoundTokenAddress} = compoundToken

        const mappedMintTransactions = mappedCompoundActions(compoundTransactions, compoundTokenAddress, "MINT", "Supply")
        const mappedRedeemTransactions = mappedCompoundActions(compoundTransactions, compoundTokenAddress, "REDEEM", "Redeem")

        return [...mappedMintTransactions, ...mappedRedeemTransactions]
            .sort((x, y) => y.timestamp - x.timestamp)
            .map(transaction => ({...transaction, timeLabel: format(transaction.timestamp * 1000, 'MMMM do, h:mma')}))
    }

    const mapLifetimeInterestEarned = (compoundToken) => {
        const {balanceOfUnderlying, lifetimeInterestEarned} = compoundToken

        if (lifetimeInterestEarned) {
            const {totalTransferredToAgent, totalTransferredFromAgent} = lifetimeInterestEarned
            // Lifetime interest = Balance of underlying + Total transferred from Agent to Compound - Total transferred to Agent from Compound
            const totalInterestOfUnderlying = new BN(balanceOfUnderlying).add(new BN(totalTransferredFromAgent)).sub(new BN(totalTransferredToAgent))
            lifetimeInterestEarned.totalInterestOfUnderlying = totalInterestOfUnderlying.toString()
        }

        return lifetimeInterestEarned
    }

    const mappedCompoundTokens = (compoundTokens || []).map(compoundToken => {
        return {
            ...compoundToken,
            compoundTransactions: mapCompoundTransactions(compoundToken),
            lifetimeInterestEarned: mapLifetimeInterestEarned(compoundToken)
        }
    })

    return {
        balances,
        compoundTokens: mappedCompoundTokens,
        tokens
    }
}