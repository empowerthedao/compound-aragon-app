const Promise = require('bluebird')

const MINE_BLOCK_COUNT = 100

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

        await mineBlocks(MINE_BLOCK_COUNT)

        console.log(`Mined: ${MINE_BLOCK_COUNT} blocks`)

    } catch (error) {
        console.log(error)
    }

    process.exit()
}
