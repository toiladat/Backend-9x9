import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { DIRECTED_AMOUNT, DISTRIBUTE_PER_USER, DISTRIBUTED_EVEN_AMOUNT, DISTRIBUTED_LEVEL_AMOUNT, SYSTEM_AMOUNT } from '~/utils/constants'

const approve = async (transaction) => {
  try {
    const boxNumber = transaction.boxNumber
    const address = transaction.address
    const user =await userModel.findUserByAddress(address)

    // const box = user.openBoxHistories.find(history => history.open == false)
    // if (box.boxNumber!=boxNumber)
    //   throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')

    // 10 U phân phối
    const distributedUser = await userModel.findDistributedUser(user.inviterChain[boxNumber - 1], boxNumber)

    return {
      invitedBy: {
        address: user.invitedBy,
        amount: DIRECTED_AMOUNT
      },
      inviterChain: [
        ...(
          user.inviterChain.map( address => ( { address, amount: DISTRIBUTE_PER_USER } ))
        )
      ],
      distributedLevelUser: {
        address: distributedUser.address,
        amount: DISTRIBUTED_LEVEL_AMOUNT
      },
      system: {
        address: process.env.SYSTEM_ADDRESS,
        amount: SYSTEM_AMOUNT + DISTRIBUTED_EVEN_AMOUNT- (user.inviterChain.length * DISTRIBUTE_PER_USER)
      }
    }
  } catch (error) { throw error}
}

const openBox = async ( transaction) => {
  try {
    const boxNumber = transaction.args.boxNumber
    const address = transaction.args.buyer
    const user =await userModel.findUserByAddress(address)

    const box = user.openBoxHistories.find(history => history.open == false)
    if (box.boxNumber!=boxNumber)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')
    await userModel.openBox(address, boxNumber)

    await userModel.transferToDirectInviter(address, user.invitedBy)

    const restMoney = 5 - 0.55- 0.55 * user.inviterChain.slice(0, 8).length
    await userModel.transferToInviterChain(user.inviterChain)
    await userModel.transferToInviterLevel(user.inviterChain[boxNumber - 1], boxNumber)
    await userModel.transferToSystemWallet(restMoney)
    return []
  } catch (error) { throw error }
}

export const boxService = {
  openBox,
  approve
}