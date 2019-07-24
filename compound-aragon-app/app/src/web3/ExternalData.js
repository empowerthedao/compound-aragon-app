import {mergeMap} from "rxjs/operators";
import {agentApp$} from "./ExternalContracts";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../SharedConstants";
import {onErrorReturnDefault} from "../lib/rxErrorOperators";

const agentEthBalance$ = (api) =>
    agentApp$(api).pipe(
        mergeMap(agentApp => agentApp.balance(ETHER_TOKEN_FAKE_ADDRESS)),
        onErrorReturnDefault('agentEthBalance', 0))

const agentInitializationBlock$ = (api) =>
    agentApp$(api).pipe(
        mergeMap(agent => agent.getInitializationBlock())
    )

export {
    agentEthBalance$,
    agentInitializationBlock$
}