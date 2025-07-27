import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { DIRECTED_AMOUNT, DISTRIBUTE_PER_USER, DISTRIBUTED_EVEN_AMOUNT, DISTRIBUTED_LEVEL_AMOUNT, SYSTEM_AMOUNT } from '~/utils/constants'

const approve = async (transaction) => {
  try {
    const boxNumber = transaction.boxNumber
    const address = transaction.address
    const user =await userModel.findUserByAddress(address)

    const box = user.openBoxHistories.find(history => history.open == false)
    if (box.boxNumber!=boxNumber)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')

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
    const { opener, boxNumber, rewards } = transaction
    const user = await userModel.findUserByAddress(opener)

    const box = user.openBoxHistories.find(history => history.open == false)
    if (box.boxNumber!=boxNumber)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')
    const updatedUser = await userModel.openBox(opener, boxNumber)

    const receivers = rewards.filter(reward => reward.address != process.env.SYSTEM_ADDRESS)
    await userModel.distributeAmounts(receivers)
    return updatedUser
  } catch (error) { throw error }
}

export const boxService = {
  openBox,
  approve
}