import AgentAbi from '../abi/agent-abi'
import ProxyDepositEvent from '../abi/proxy-deposit-event'
import ERC20Abi from '../abi/erc20-abi'
import ERC20DaiAbi from '../abi/erc20-dai-abi'
import CERC20Abi from '../abi/cerc20-abi'
import {of} from 'rxjs'
import {concatMap, map, mergeMap, toArray} from 'rxjs/operators'
import { convertToDaiErc20Abi, makeAbiFunctionConstant } from "../lib/abi-utils"
import { ETHER_TOKEN_VERIFIED_BY_SYMBOL } from "../lib/verified-tokens"

// Currently the AragonApi provides no option to "call" non-constant functions on external contracts so we modify
// the CERC20Abi so we can "call" the non-constant balanceOfUnderlying function.
const modifiedCERC20Abi = makeAbiFunctionConstant('balanceOfUnderlying', CERC20Abi)

const agentAddress$ = api => api.call('agent')

const compoundTokenAddresses$ = api => api.call('getEnabledCErc20s')

const agentApp$ = (api) => {
    const agentProxyDepositAbi = AgentAbi.concat([ProxyDepositEvent])
    return agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, agentProxyDepositAbi)))
}

const tokenContract$ = (api, tokenAddress) => {
    if (tokenAddress.toLowerCase() === ETHER_TOKEN_VERIFIED_BY_SYMBOL.get("DAI")) {
        return of(api.external(tokenAddress, ERC20DaiAbi))
    } else {
        return of(api.external(tokenAddress, ERC20Abi))
    }
}

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