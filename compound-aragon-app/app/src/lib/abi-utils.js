
const makeAbiFunctionConstant = (functionName, originalAbi) => {
    const abiFunction = originalAbi.filter(abiFunction => abiFunction.name === functionName)[0]
    abiFunction.constant = "true"

    const modifiedAbi = originalAbi.filter(abiFunction => abiFunction.name !== functionName).slice(0)
    modifiedAbi.push(abiFunction)

    return modifiedAbi
}

export {
    makeAbiFunctionConstant
}
