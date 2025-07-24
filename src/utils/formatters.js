import { ethers } from 'ethers'

export const formatParsedLog = (parsedLog) => {
  return {
    eventName: parsedLog.name,
    eventSignature: parsedLog.signature,
    eventTopic: parsedLog.topic,
    args: {
      buyer: parsedLog.args[0], // address
      boxNumber: Number(parsedLog.args[1]), // uint8 → number
      price: Number(ethers.formatUnits(parsedLog.args[3][0], 6)) // uint256 → ether (string)
    }
  }
}
