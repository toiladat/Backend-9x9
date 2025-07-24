import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const openBox = async (address, transaction) => {
  try {
    const boxNumber = transaction.args.boxNumber

    const user =await userModel.findUserByAddress(address)

    const box = user.openBoxHistories.find(history => history.open == false)
    if (box.boxNumber!=boxNumber)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')
    await userModel.openBox(address, boxNumber)

    await userModel.transferToDirectInviter(address, user.invitedBy)

    const restMoney = 5 - 0.55 * user.inviterChain
    await userModel.transferToInviterChain(user.inviterChain)
    await userModel.transferToInviterLevel(user.inviterChain[boxNumber - 1], boxNumber)
    await userModel.transferToSystemWallet(restMoney)
    return []
  } catch (error) {
    throw error
  }
}

export const boxService = {
  openBox
}