import AgentAbi from '../abi/agent-abi'
import ProxyDepositEvent from '../abi/proxy-deposit-event'
import ERC20Abi from '../abi/erc20-abi'
import CERC20Abi from '../abi/cerc20-abi'
import {of} from 'rxjs'
import {concatMap, map, mergeMap, toArray} from 'rxjs/operators'
import {makeAbiFunctionConstant} from "../lib/abi-utils";

// Currently the AragonApi provides no option to "call" non-constant functions on external contracts so we modify
// the CERC20Abi so we can "call" the non-constant balanceOfUnderlying function.
const modifiedCERC20Abi = makeAbiFunctionConstant('balanceOfUnderlying', CERC20Abi)

const agentAddress$ = api => api.call('agent')

const compoundTokenAddresses$ = api => api.call('getEnabledCTokens')

const agentApp$ = (api) => {
    const agentProxyDepositAbi = AgentAbi.concat([ProxyDepositEvent])
    return agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, agentProxyDepositAbi)))
}

const tokenContract$ = (api, tokenAddress) => of(api.external(tokenAddress, ERC20Abi))

const compoundToken$ = (api, compoundTokenAddress) => of(api.external(compoundTokenAddress, modifiedCERC20Abi))

const allCompoundTokens$ = (api) =>
    compoundTokenAddresses$(api).pipe(
        concatMap(address => address),
        mergeMap(compoundTokenAddress => compoundToken$(api, compoundTokenAddress)),
        map(compoundToken => ({contract: compoundToken})),
        toArray())

export {
    agentAddress$,
    compoundTokenAddresses$,
    agentApp$,
    tokenContract$,
    compoundToken$,
    allCompoundTokens$
}