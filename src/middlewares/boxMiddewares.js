import ethers from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { contractABI } from '~/config/abi'
import { GET_CONTRACT } from '~/config/contract'
import ApiError from '~/utils/ApiError'
const validTransaction = async (req, res, next) => {
  try {
    const { address } = req.decoded
    const { txHash } = req.body
    const { provider } = await GET_CONTRACT()

    const receipt = await provider.getTransactionReceipt(txHash)
    const iface = new ethers.Interface(contractABI)

    if ( ! receipt.status) { throw new ApiError(StatusCodes.BAD_REQUEST, 'Giao dịch chưa hoàn thành') }
    const contractAddress = process.env.CONTRACT_ADDRESS
    const targetLog = receipt.logs.find(
      log => log.address.toLowerCase() === contractAddress.toLowerCase()
    )
    const parsedLog = iface.parseLog(targetLog)
    if ( parsedLog.name !== address) throw new ApiError(StatusCodes.BAD_REQUEST, 'Địa chỉ ví không khớp với mã giao dịch')
    req.transaction = parsedLog
    next()
  } catch (error) {
    next(error)
  }
}
export const boxMiddewares ={
  validTransaction
}