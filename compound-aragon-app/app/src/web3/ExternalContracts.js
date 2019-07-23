import AgentAbi from '../abi/agent-abi'
import {map} from 'rxjs/operators'

const agentAddress$ = api => api.call('agent')

const agentApp$ = (api) =>
    agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, AgentAbi)))

export {
    agentAddress$,
    agentApp$
}