const DeploymentInfo = require('../networks/development')
const CEther = artifacts.require('CEther')
const CErc20 = artifacts.require('CErc20')
const FaucetToken = artifacts.require('FaucetToken')
const Comptroller = artifacts.require('Comptroller')
const BN = require('bn.js')
const Promise = require('bluebird')

const mineBlock = Promise.promisify(function(done) {
        web3.currentProvider.send({
            'jsonrpc': "2.0",
            "method": "evm_mine",
            'params': []}, done)
    }
)

const mineBlocks = async (numOfBlocks) => {
    for (let i = 0; i < numOfBlocks; i++) {
        await mineBlock()
    }
}

module.exports = async () => {

    try {

        let receipt
        const daiWithDecimals = (daiValue) => new BN(daiValue).mul(new BN(10).pow(new BN(18)))
        const threeEthInWei = web3.utils.toWei('3', 'ether')
        const tenEthInWei = web3.utils.toWei('10', 'ether')
        const threeHundredDai = daiWithDecimals(300)

        const accounts = await web3.eth.getAccounts()
        const lender = accounts[0]
        const lender2 = accounts[1]
        const borrower = accounts[2]

        const cEther = await CEther.at(DeploymentInfo.Contracts.cETH)
        const dai = await FaucetToken.at(DeploymentInfo.Contracts.DAI)
        const cDai = await CErc20.at(DeploymentInfo.Contracts.cDAI)
        const comptroller = await Comptroller.at(await cDai.comptroller())


        // Enter Markets (Executed once per deployment)
        await comptroller.enterMarkets([DeploymentInfo.Contracts.cDAI, DeploymentInfo.Contracts.cETH], {from: borrower})


        // Lender Lend ETH
        // console.log(`Eth balance before minting: ${await web3.eth.getBalance(lender)}`)
        //
        // await cEther.mint({value: threeEthInWei})
        //
        // console.log(`Eth balance after minting: ${await web3.eth.getBalance(lender)}`)

        // const underlyingBalanceEth = await cEther.balanceOfUnderlying.call(lender)
        // await cEther.redeemUnderlying(underlyingBalanceEth)
        //
        // console.log(`ETh balance after redeeming underlying asset: ${await web3.eth.getBalance(lender)}`)


        // Lender Lend DAI
        await dai.allocateTo(lender, threeHundredDai)

        console.log(`Lender 1 Dai balance before lending: ${(await dai.balanceOf(lender)).toString()}`)

        await dai.approve(cDai.address, threeHundredDai)
        await cDai.mint(threeHundredDai)

        console.log(`Lender 1 Dai balance after lending: ${(await dai.balanceOf(lender)).toString()}\n`)


        // Lender 2 Lend DAI
        await dai.allocateTo(lender2, threeHundredDai, {from: lender2})

        console.log(`Lender 2 Dai balance before lending 2: ${(await dai.balanceOf(lender2)).toString()}`)

        await dai.approve(cDai.address, threeHundredDai, {from: lender2})
        await cDai.mint(threeHundredDai, {from: lender2})

        console.log(`Lender 2 Dai balance after lending 2: ${(await dai.balanceOf(lender2)).toString()}\n`)


        // Borrower Lend ETH
        await cEther.mint({value:tenEthInWei, from: borrower})


        // Borrower Borrow DAI
        console.log(`cDai Dai available: ${(await cDai.getCash()).toString()}`)

        console.log(`Borrower Dai balance before borrowing: ${(await dai.balanceOf(borrower)).toString()}`)
        receipt = await cDai.borrow(daiWithDecimals(10), {from: borrower})
        // console.log(receipt.logs)
        console.log(`Borrower Dai balance after borrowing: ${(await dai.balanceOf(borrower)).toString()}`)

        console.log(`cDai Dai available after borrowing: ${(await cDai.getCash()).toString()}\n`)


        // Borrower Repay DAI
        await dai.approve(cDai.address, daiWithDecimals(9999), {from: borrower})
        await dai.allocateTo(borrower, daiWithDecimals(1))

        const totalOwed = await cDai.totalBorrowsCurrent.call()
        console.log(`Total Dai owed to the cDai contract: ${totalOwed}`)

        const owed = await cDai.borrowBalanceCurrent.call(borrower)
        console.log(`Borrower Dai owed to cDai contract: ${owed}`)

        receipt = await cDai.repayBorrow(owed, {from: borrower})
        // console.log(receipt.logs)

        // console.log(`Borrower Dai balance after repayed: ${(await dai.balanceOf(borrower)).toString()}`)
        console.log(`cDai Dai available after borrower repayed: ${(await cDai.getCash()).toString()}\n`)


        // Lender Redeem Underlying
        console.log(`Lender 1 Dai balance before redeeming underlying asset: ${(await dai.balanceOf(lender)).toString()}`)

        const underlyingBalanceDai = await cDai.balanceOfUnderlying.call(lender)
        console.log(`Lender 1 underlying Dai balance: ${underlyingBalanceDai}`)
        receipt = await cDai.redeemUnderlying(underlyingBalanceDai)
        // console.log(receipt)

        console.log(`Lender 1 Dai balance after redeeming underlying asset: ${(await dai.balanceOf(lender)).toString()}`)


        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}