import AgentAbi from '../abi/agent-abi'
import ProxyDepositEvent from '../abi/proxy-deposit-event'
import {map} from 'rxjs/operators'

const agentAddress$ = api => api.call('agent')

const agentApp$ = (api) => {
    const agentProxyDepositAbi = AgentAbi.concat([ProxyDepositEvent])
    return agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, agentProxyDepositAbi)))
}

export {
    agentAddress$,
    agentApp$
}