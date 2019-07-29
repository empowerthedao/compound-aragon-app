const CompoundApp = artifacts.require('CompoundApp')
const Agent = artifacts.require('Agent')
const TokenMock = artifacts.require('TokenMock')
import {deployedContract} from "./helpers/helpers"
import {DaoDeployment, Snapshot, TemplateAgentChainSetup} from "./helpers/ChainSetup"
import BN from 'bn.js'

const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'
const ETH_TOKEN_ADDR = '0x0000000000000000000000000000000000000000'
const TOKEN_BALANCE = 1000

contract('CompoundApp', ([rootAccount, ...accounts]) => {

    let chainSetup = new TemplateAgentChainSetup(new Snapshot(web3), new DaoDeployment(rootAccount))
    let compoundAppBase, compoundApp, agentBase, agent, token
    let SET_AGENT_ROLE, EXECUTE_ROLE, TRANSFER_ROLE

    before(async () => {
        await chainSetup.before()

        compoundAppBase = await CompoundApp.new()
        SET_AGENT_ROLE = await compoundAppBase.SET_AGENT_ROLE()
        TRANSFER_ROLE = await compoundAppBase.TRANSFER_ROLE()

        agentBase = await Agent.new()
        EXECUTE_ROLE = await agentBase.EXECUTE_ROLE()
    })

    beforeEach(async () => {
        await chainSetup.beforeEach()

        const newCompoundAppReceipt = await chainSetup.daoDeployment.kernel.newAppInstance('0x1234', compoundAppBase.address)
        compoundApp = await CompoundApp.at(deployedContract(newCompoundAppReceipt))

        const newAgentReceipt = await chainSetup.daoDeployment.kernel.newAppInstance('0x5678', agentBase.address)
        agent = await Agent.at(deployedContract(newAgentReceipt))
        await agent.initialize();

        token = await TokenMock.new(rootAccount, TOKEN_BALANCE)
    })

    afterEach(async () => {
        await chainSetup.afterEach()
    })

    describe('initialize(address _agent)', () => {

        beforeEach(async () => {
            await compoundApp.initialize(agent.address)
        })

        it('sets correct agent address', async () => {
            const actualAgent = await compoundApp.agent()
            assert.strictEqual(actualAgent, agent.address)
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

        describe('deposit(address _token, uint256 _value)', () => {

            const expectedEthBalance = 999
            const expectedTokenBalance = 888

            beforeEach(async () => {
                await compoundApp.deposit(ETH_TOKEN_ADDR, expectedEthBalance, {value: expectedEthBalance})

                await token.approve(compoundApp.address, TOKEN_BALANCE)
                await compoundApp.deposit(token.address, expectedTokenBalance)
            })

            it('deposits ETH to the agent', async () => {
                const actualEthBalance = await web3.eth.getBalance(agent.address)
                assert.equal(actualEthBalance, expectedEthBalance)
            })

            it('deposits tokens to the agent', async () => {
                const actualTokenBalance = await token.balanceOf(agent.address)
                assert.equal(actualTokenBalance, expectedTokenBalance)
            })

            describe('transfer(address _token, address _to, uint256 _value)', () => {

                const recipient = accounts[0]

                beforeEach(async () => {
                    await chainSetup.daoDeployment.acl.createPermission(rootAccount, compoundApp.address, TRANSFER_ROLE, rootAccount)
                    await chainSetup.daoDeployment.acl.createPermission(compoundApp.address, agent.address, TRANSFER_ROLE, rootAccount)
                })

                it('transfers ETH to the address specified', async () => {
                    const ethValue = 777
                    const expectedEthBalance = (new BN(await web3.eth.getBalance(recipient))).add(new BN(ethValue))

                    await compoundApp.transfer(ETH_TOKEN_ADDR, recipient, ethValue)

                    const actualEthBalance = await web3.eth.getBalance(recipient)
                    assert.equal(actualEthBalance, expectedEthBalance)
                })

                it('transfers Tokens to the address specified', async () => {
                    const expectedTokenBalance = 666

                    await compoundApp.transfer(token.address, recipient, expectedTokenBalance)

                    const actualTokenBalance = await token.balanceOf(recipient)
                    assert.equal(actualTokenBalance, expectedTokenBalance)
                })
            })
        })
    })
})