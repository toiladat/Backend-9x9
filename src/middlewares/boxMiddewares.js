import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { contractABI } from '~/config/abi'
import { GET_CONTRACT } from '~/config/contract'
import ApiError from '~/utils/ApiError'
import { OPEN_BOX_AMOUNT } from '~/utils/constants'
import { formatParsedLog } from '~/utils/formatters'

const validTransactionApprove = async (req, res, next) => {
  try {

    const { address } = req.decoded
    const { txHash, boxNumber } = req.body

    const { provider } = await GET_CONTRACT()
    const receipt = await provider.getTransactionReceipt(txHash)
    if ( receipt?.status != 1) { throw new ApiError(StatusCodes.BAD_REQUEST, 'Giao dịch chưa hoàn thành') }
    const contractUsdtAddress = process.env.CONTRACT_MUSDT_ADDRESS
    const targetLog = receipt.logs.find(
      log => log.address.toLowerCase() === contractUsdtAddress.toLowerCase()
    )
    if (!targetLog) throw new ApiError(StatusCodes.BAD_REQUEST, 'Contract USDT không khớp')
    const addressParseLog = '0x'+ targetLog.topics[1].slice(26)

    if ( addressParseLog.toLocaleLowerCase() !== address.toLowerCase()) throw new ApiError(StatusCodes.BAD_REQUEST, 'Địa chỉ ví không khớp với mã giao dịch')

    const formatReceipt = {
      address,
      amount: Number(ethers.formatUnits(targetLog.data, 18)),
      boxNumber: boxNumber
    }
    if (formatReceipt.amount < OPEN_BOX_AMOUNT) throw new ApiError(StatusCodes.BAD_REQUEST, 'Số tiền Approve không đủ')
    req.transaction = formatReceipt
    next()
  } catch (error) { next(error) }
}

const validTransactionOpenBox = async (req, res, next) => {
  try {

    const { address } = req.decoded
    const { txHash } = req.body
    const { provider } = await GET_CONTRACT()

    const receipt = await provider.getTransactionReceipt(txHash)
    const iface = new ethers.Interface(contractABI)

    if ( receipt.status != 1) { throw new ApiError(StatusCodes.BAD_REQUEST, 'Giao dịch chưa hoàn thành') }
    const contractAddress = process.env.CONTRACT_ADDRESS
    const targetLog = receipt.logs.find(
      log => log.address.toLowerCase() === contractAddress.toLowerCase()
    )
    if (!targetLog) throw new ApiError(StatusCodes.BAD_REQUEST, 'Contract không khớp')

    const parsedLog = iface.parseLog(targetLog)

    if ( parsedLog.args[0].toLowerCase() !== address.toLowerCase()) throw new ApiError(StatusCodes.BAD_REQUEST, 'Địa chỉ ví không khớp với mã giao dịch')
    req.transaction = formatParsedLog(parsedLog, 18)

    next()
  } catch (error) {
    next(error) }
}

export const boxMiddewares = {
  validTransactionOpenBox,
  validTransactionApprove
}
