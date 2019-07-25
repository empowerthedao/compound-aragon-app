import {mergeMap, map, merge, tap, toArray} from "rxjs/operators";
import {agentApp$} from "./ExternalContracts";
import {ETHER_TOKEN_FAKE_ADDRESS, ETH_DECIMALS} from "../lib/shared-constants";
import {onErrorReturnDefault} from "../lib/rx-error-operators";

const agentInitializationBlock$ = (api) =>
    agentApp$(api).pipe(
        mergeMap(agent => agent.getInitializationBlock())
    )

const agentEthBalance$ = api =>
    agentApp$(api).pipe(
        mergeMap(agentApp => agentApp.balance(ETHER_TOKEN_FAKE_ADDRESS)),
        tap(balance => console.log("BALANCE: " + balance)),
        map(balance => ({
            decimals: ETH_DECIMALS,
            name: "ETHER",
            symbol: "ETH",
            address: ETHER_TOKEN_FAKE_ADDRESS,
            amount: balance,
            verified: true,
        }),
            onErrorReturnDefault('agentEthBalance', {
                decimals: ETH_DECIMALS,
                name: "ETHER",
                symbol: "ETH",
                address: ETHER_TOKEN_FAKE_ADDRESS,
                amount: 0,
                verified: true,
            }))
    )

const balances$ = api =>
    agentEthBalance$(api).pipe(
        toArray(),
        onErrorReturnDefault('agentBalances', [])
    )

export {
    agentInitializationBlock$,
    balances$
}