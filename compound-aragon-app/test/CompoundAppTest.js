const Compound = artifacts.require('Compound')
const Agent = artifacts.require('Agent')
const TokenMock = artifacts.require('TokenMock')
const MockCErc20 = artifacts.require('MockCErc20')
import {deployedContract, assertRevert} from "./helpers/helpers"
import {DaoDeployment, Snapshot, TemplateAgentChainSetup} from "./helpers/ChainSetup"
import BN from 'bn.js'

const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'
const ETH_TOKEN_ADDR = '0x0000000000000000000000000000000000000000'
const TOKEN_BALANCE = 1000

// TODO: Complete tests and use real cErc20 instead of mock cErc20 for more accurate gas estimations.
contract('Compound', ([rootAccount, ...accounts]) => {

    let chainSetup = new TemplateAgentChainSetup(new Snapshot(web3), new DaoDeployment(rootAccount))
    let compoundBase, compound, agentBase, agent, token, mockCErc20
    let SET_AGENT_ROLE, EXECUTE_ROLE, TRANSFER_ROLE, SAFE_EXECUTE_ROLE, MODIFY_CTOKENS_ROLE, SUPPLY_ROLE

    before(async () => {
        await chainSetup.before()

        compoundBase = await Compound.new()
        SET_AGENT_ROLE = await compoundBase.SET_AGENT_ROLE()
        TRANSFER_ROLE = await compoundBase.TRANSFER_ROLE()
        MODIFY_CTOKENS_ROLE = await compoundBase.MODIFY_CTOKENS_ROLE()
        SUPPLY_ROLE = await compoundBase.SUPPLY_ROLE()

        agentBase = await Agent.new()
        EXECUTE_ROLE = await agentBase.EXECUTE_ROLE()
        SAFE_EXECUTE_ROLE = await agentBase.SAFE_EXECUTE_ROLE()
    })

    beforeEach(async () => {
        await chainSetup.beforeEach()

        const newCompoundReceipt = await chainSetup.daoDeployment.kernel.newAppInstance('0x1234', compoundBase.address)
        compound = await Compound.at(deployedContract(newCompoundReceipt))

        const newAgentReceipt = await chainSetup.daoDeployment.kernel.newAppInstance('0x5678', agentBase.address)
        agent = await Agent.at(deployedContract(newAgentReceipt))
        await agent.initialize();

        token = await TokenMock.new(rootAccount, TOKEN_BALANCE)

        mockCErc20 = await MockCErc20.new(token.address)
    })

    afterEach(async () => {
        await chainSetup.afterEach()
    })

    describe('initialize(address _agent)', () => {

        beforeEach(async () => {
            await compound.initialize(agent.address, [mockCErc20.address])
        })

        it('sets correct agent address', async () => {
            const actualAgent = await compound.agent()
            assert.strictEqual(actualAgent, agent.address)
        })

        describe('setAgent(address _agent)', () => {

            it('changes the agent address', async () => {
                const newAgentReceipt = await chainSetup.daoDeployment.kernel.newAppInstance('0x5679', agentBase.address)
                const newAgent = await Agent.at(deployedContract(newAgentReceipt))
                const expectedAgentAddress = newAgent.address
                await chainSetup.daoDeployment.acl.createPermission(rootAccount, compound.address, SET_AGENT_ROLE, rootAccount)

                await compound.setAgent(expectedAgentAddress)

                const actualAgentAddress = await compound.agent()
                assert.strictEqual(actualAgentAddress, expectedAgentAddress)
            })
        })

        describe('max enabled cTokens', async () => {

            let enabledCErc20s = []

            beforeEach('enable max cTokens', async () => {
                await chainSetup.daoDeployment.acl.createPermission(rootAccount, compound.address, MODIFY_CTOKENS_ROLE, rootAccount)
                const MAX_ENABLED_CERC20S = await compound.MAX_ENABLED_CERC20S()
                for (let i = 0; i < MAX_ENABLED_CERC20S - 1; i++) {
                    mockCErc20 = await MockCErc20.new(token.address)
                    await compound.enableCErc20(mockCErc20.address)
                    enabledCErc20s.push(mockCErc20)
                }
            })

            it("can't enable more than max enabled cTokens", async () => {
                mockCErc20 = await MockCErc20.new(token.address)
                await assertRevert(compound.enableCErc20(mockCErc20.address), "COMPOUND_TOO_MANY_CERC20S")
            })

            it("can remove last cToken within allowable gas limit", async () => {
                const maxGasAllowed = 500000
                const receipt = await compound.disableCErc20(enabledCErc20s[enabledCErc20s.length - 1].address)
                assert.isBelow(receipt.receipt.gasUsed, maxGasAllowed)
            })

            // Note we are using a mockCErc20 with no computation in the 'mint()' function. However, manual execution of
            // supplyToken() via the app costs 227900 gas, therefore this operation should never cost upwards of
            // this operation cost + 227900.
            it("can call supplyToken() on last cToken enabled within allowable gas limit", async () => {
                await chainSetup.daoDeployment.acl.createPermission(compound.address, agent.address, SAFE_EXECUTE_ROLE, rootAccount)
                await chainSetup.daoDeployment.acl.createPermission(rootAccount, compound.address, SUPPLY_ROLE, rootAccount)
                const maxGasAllowed = 500000 + 227900 // Max gas is this operation cost plus supplyToken() typical cost.
                const receipt = await compound.supplyToken(999, enabledCErc20s[enabledCErc20s.length - 1].address)
                assert.isBelow(receipt.receipt.gasUsed, maxGasAllowed)
            })
        })

        describe('deposit(address _token, uint256 _value)', () => {

            const expectedEthBalance = 999
            const expectedTokenBalance = 888

            beforeEach(async () => {
                await compound.deposit(ETH_TOKEN_ADDR, expectedEthBalance, {value: expectedEthBalance})

                await token.approve(compound.address, TOKEN_BALANCE)
                await compound.deposit(token.address, expectedTokenBalance)
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
                    await chainSetup.daoDeployment.acl.createPermission(rootAccount, compound.address, TRANSFER_ROLE, rootAccount)
                    await chainSetup.daoDeployment.acl.createPermission(compound.address, agent.address, TRANSFER_ROLE, rootAccount)
                })

                it('transfers ETH to the address specified', async () => {
                    const ethValue = 777
                    const expectedEthBalance = (new BN(await web3.eth.getBalance(recipient))).add(new BN(ethValue))

                    await compound.transfer(ETH_TOKEN_ADDR, recipient, ethValue)

                    const actualEthBalance = await web3.eth.getBalance(recipient)
                    assert.equal(actualEthBalance, expectedEthBalance)
                })

                it('transfers Tokens to the address specified', async () => {
                    const expectedTokenBalance = 666

                    await compound.transfer(token.address, recipient, expectedTokenBalance)

                    const actualTokenBalance = await token.balanceOf(recipient)
                    assert.equal(actualTokenBalance, expectedTokenBalance)
                })
            })
        })
    })
})