const DeploymentInfo = require('../networks/development')
const CEther = artifacts.require('CEther')
const CErc20 = artifacts.require('CErc20')
const FaucetToken = artifacts.require('FaucetToken')
const Comptroller = artifacts.require('Comptroller')
const BN = require('bn.js')

module.exports = async () => {

    try {

        let receipt
        const daiWithDecimals = (daiValue) => new BN(daiValue).mul(new BN(10).pow(new BN(18)))
        const tenEthInWei = web3.utils.toWei('10', 'ether')
        const threeHundredDai = daiWithDecimals(300)

        const accounts = await web3.eth.getAccounts()
        const lender = accounts[0]
        const borrower = accounts[1]

        const cEther = await CEther.at(DeploymentInfo.Contracts.cETH)
        const dai = await FaucetToken.at(DeploymentInfo.Contracts.DAI)
        const cDai = await CErc20.at(DeploymentInfo.Contracts.cDAI)
        const comptroller = await Comptroller.at(await cDai.comptroller())


        // Enter Markets (Executed once per deployment)
        await comptroller.enterMarkets([DeploymentInfo.Contracts.cDAI, DeploymentInfo.Contracts.cETH], {from: borrower})


        // Lender Lend DAI
        await dai.allocateTo(lender, threeHundredDai)

        console.log(`Dai balance before minting: ${(await dai.balanceOf(lender)).toString()}`)

        await dai.approve(cDai.address, threeHundredDai)
        await cDai.mint(threeHundredDai)

        console.log(`Dai balance after minting: ${(await dai.balanceOf(lender)).toString()}`)


        // Borrower Lend ETH
        await cEther.mint({value:tenEthInWei, from: borrower})


        // Borrower Borrow DAI
        console.log(`cDai cash available: ${(await cDai.getCash()).toString()}`)

        console.log(`Dai balance before borrowing: ${(await dai.balanceOf(borrower)).toString()}`)
        receipt = await cDai.borrow(daiWithDecimals(10), {from: borrower})
        // console.log(receipt.logs)
        console.log(`Dai balance after borrowing: ${(await dai.balanceOf(borrower)).toString()}`)

        console.log(`cDai cash available after borrowing: ${(await cDai.getCash()).toString()}`)


        // Borrower Repay DAI
        await dai.approve(cDai.address, daiWithDecimals(999), {from: borrower})
        await dai.allocateTo(borrower, daiWithDecimals(1))

        const totalOwed = await cDai.totalBorrowsCurrent.call()
        console.log(`Total owed to cDai contract: ${totalOwed}`)

        const owed = await cDai.borrowBalanceCurrent.call(borrower)
        console.log(`Borrower owes: ${owed}`)

        receipt = await cDai.repayBorrow(owed, {from: borrower})
        // console.log(receipt.logs)

        console.log(`Dai balance after repaying: ${(await dai.balanceOf(borrower)).toString()}`)
        console.log(`cDai cash available after repaying: ${(await cDai.getCash()).toString()}`)



        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}