const CompoundApp = artifacts.require('CompoundApp')
import {deployedContract} from "./helpers/helpers"
import {DaoDeployment, Snapshot, TemplateAgentChainSetup} from "./helpers/ChainSetup"

const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'

contract('CompoundApp', ([rootAccount, ...accounts]) => {

    let chainSetup = new TemplateAgentChainSetup(new Snapshot(web3), new DaoDeployment(rootAccount))
    let compoundAppBase, compoundApp
    let SET_AGENT_ROLE

    before(async () => {
        await chainSetup.before()

        compoundAppBase = await CompoundApp.new()
        SET_AGENT_ROLE = await compoundAppBase.SET_AGENT_ROLE()
    })

    beforeEach(async () => {
        await chainSetup.beforeEach()

        const newCompoundAppReceipt = await chainSetup.daoDeployment.kernel
            .newAppInstance('0x1234', compoundAppBase.address, '0x', false, {from: rootAccount})
        compoundApp = await CompoundApp.at(deployedContract(newCompoundAppReceipt))
    })

    afterEach(async () => {
        await chainSetup.afterEach()
    })

    describe('initialize(address _agent)', () => {

        const agentAddress = accounts[0]

        beforeEach(async () => {
            await compoundApp.initialize(agentAddress)
        })

        it('sets correct agent address', async () => {
            const actualAgent = await compoundApp.agent()
            assert.strictEqual(actualAgent, agentAddress)
        })

        describe('setAgent(address _agent)', () => {

            it('changes the agent address', async () => {
                const expectedAgentAddress = accounts[1]
                await chainSetup.daoDeployment.acl.createPermission(rootAccount, compoundApp.address, SET_AGENT_ROLE, rootAccount)

                await compoundApp.setAgent(expectedAgentAddress)

                const actualAgentAddress = await compoundApp.agent()
                assert.strictEqual(actualAgentAddress, expectedAgentAddress)
            })

        })
    })

})