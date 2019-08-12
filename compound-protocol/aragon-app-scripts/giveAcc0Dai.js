const DeploymentInfo = require('../networks/development')
const FaucetToken = artifacts.require('FaucetToken')
const BN = require('bn.js')

module.exports = async () => {

    try {
        const receiver = (await web3.eth.getAccounts())[0]
        const daiWithDecimals = (daiValue) => new BN(daiValue).mul(new BN(10).pow(new BN(18)))

        const dai = await FaucetToken.at(DeploymentInfo.Contracts.DAI)
        await dai.allocateTo(receiver, daiWithDecimals(10000))

        console.log(`Dai balance of ${receiver}: ${(await dai.balanceOf(receiver)).toString()}`)

    } catch (error) {
        console.log(error)
    }

    process.exit()
}
