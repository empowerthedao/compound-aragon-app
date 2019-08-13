
const makeAbiFunctionConstant = (functionName, originalAbi) => {
    const balanceOfUnderlyingAbi = originalAbi.filter(abiFunction => abiFunction.name === functionName)[0]
    balanceOfUnderlyingAbi.constant = "true"

    const modifiedAbi = originalAbi.filter(abiFunction => abiFunction.name !== functionName).slice(0)
    modifiedAbi.push(balanceOfUnderlyingAbi)

    return modifiedAbi
}

export {
    makeAbiFunctionConstant
}
