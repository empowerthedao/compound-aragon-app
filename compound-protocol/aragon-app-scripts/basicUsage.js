const DeploymentInfo = require('../networks/development')
const CEther = artifacts.require('CEther')

module.exports = async () => {

    try {

        const threeEthInWei = web3.utils.toWei('3', 'ether')
        const accounts = await web3.eth.getAccounts()
        const senderAccount = accounts[0]

        const cEther = await CEther.at(DeploymentInfo.Contracts.cETH)

        console.log(`Balance before minting: ${await web3.eth.getBalance(senderAccount)}`)

        await cEther.mint({value: threeEthInWei})

        console.log(`Balance after minting: ${await web3.eth.getBalance(senderAccount)}`)

        const underlyingBalance = await cEther.balanceOfUnderlying.call(senderAccount)
        await cEther.redeemUnderlying(underlyingBalance)

        console.log(`Balance after redeeming underlying asset: ${await web3.eth.getBalance(senderAccount)}`)

        process.exit()

    } catch (error) {
        console.log(error)
        process.exit()
    }
}