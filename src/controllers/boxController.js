import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { contractABI } from '~/config/abi'
import { GET_CONTRACT } from '~/config/contract'
import ApiError from '~/utils/ApiError'
import { boxService } from '~/services/boxService'

const openBox = async (req, res, next ) => {
  try {
    const parsedLog= req.transaction
    const formattedLog = {
      eventName: parsedLog.name,
      args: {
        buyer: parsedLog.args[0], // Địa chỉ
        boxId: Number(parsedLog.args[1]), // Chuyển BigInt -> number
        price: ethers.formatUnits(parsedLog.args[2], 18) // Chuyển wei -> ether
      }
    }
    // const result = await boxService.openBox()
    res.json({
      formattedLog
    })
  } catch (error) { next(error)}
}

export const boxController = {
  openBox
}
