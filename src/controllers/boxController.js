import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { contractABI } from '~/config/abi'
import { GET_CONTRACT } from '~/config/contract'
import ApiError from '~/utils/ApiError'

const openBox = async (req, res, next ) => {
  const { txHash } = req.body
  const { provider } = await GET_CONTRACT()
  const receipt = await provider.getTransactionReceipt(txHash)
  const iface = new ethers.Interface(contractABI)
  if ( ! receipt.status) { throw new ApiError(StatusCodes.BAD_REQUEST, 'txHash sai') }

  const contractAddress = process.env.CONTRACT_ADDRESS
  const targetLog = receipt.logs.find(
    log => log.address.toLowerCase() === contractAddress.toLowerCase()
  )
  console.log('🚀 ~ boxController.js:18 ~ openBox ~ targetLog:', targetLog)
  
  const parsedLog = iface.parseLog(targetLog)
  console.log('🚀 ~ boxController.js:19 ~ openBox ~ parsedLog:', parsedLog)
  const formattedLog = {
    eventName: parsedLog.name,
    args: {
      buyer: parsedLog.args[0], // Địa chỉ
      boxId: Number(parsedLog.args[1]), // Chuyển BigInt -> number
      price: ethers.formatUnits(parsedLog.args[2], 18) // Chuyển wei -> ether
    }
  }

  res.json({
    formattedLog
  })
}
export const boxController = {
  openBox
}