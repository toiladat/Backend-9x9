import { ethers } from 'ethers'

export const formatParsedLog = (parsedLog) => {
  return {
    eventName: parsedLog.name,
    eventSignature: parsedLog.signature,
    eventTopic: parsedLog.topic,
    args: {
      buyer: parsedLog.args[0], // address
      boxId: Number(parsedLog.args[1]), // uint8 → number
      price: ethers.formatUnits(parsedLog.args[2], 18) // uint256 → ether (string)
    },
    fragment: {
      inputs: parsedLog.fragment.inputs.map(input => ({
        name: input.name,
        type: input.type,
        baseType: input.baseType
      }))
    }
  }
}
