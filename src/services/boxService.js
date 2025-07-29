import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { DIRECTED_AMOUNT_VALUE, DISTRIBUTE_PER_USER, REFERRAL_CHAIN_AMOUNT_VALUE , DISTRIBUTED_AMOUNT_VALUE , SYSTEM_AMOUNT_VALUE  } from '~/utils/constants'

const approve = async (transaction) => {
  try {
    const boxNumber = transaction.boxNumber
    console.log('🚀 ~ boxService.js:9 ~ approve ~ boxNumber:', boxNumber)
    const address = transaction.address
    const user =await userModel.findUserByAddress(address)

    const box = user.openBoxHistories.find(history => history.open == false)
    if (box.boxNumber!=boxNumber)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')
    console.log(user.inviterChain);
    
    // 10 U phân phối
    const distributedUser = await userModel.findDistributedUser(user.inviterChain[boxNumber - 1], boxNumber)

    return {
      invitedBy: {
        address: user.invitedBy,
        amount: DIRECTED_AMOUNT_VALUE
      },
      inviterChain: [
        ...(
          user.inviterChain.map( address => ( { address, amount: DISTRIBUTE_PER_USER } ))
        )
      ],
      distributedLevelUser: {
        address: distributedUser.address,
        amount: DISTRIBUTED_AMOUNT_VALUE
      },
      system: {
        address: process.env.SYSTEM_ADDRESS,
        amount: SYSTEM_AMOUNT_VALUE + REFERRAL_CHAIN_AMOUNT_VALUE - (user.inviterChain.length * DISTRIBUTE_PER_USER).toFixed(2)
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

const getDetail = async (data) => {
  try {
    const user = await userModel.findUserByAddress(data.address)
    const invitedCount = await userModel.getInvitedUsers(user.address)
    const result = {
      invitedCount,
      boxNumber:user.openBoxHistories.filter(history => history.open).length,
      invitedBy: user.invitedBy,
      directedAmount: user.directedAmount,
      distributedAmount: user.distributedAmount,
      referralChainAmount:user.referralChainAmount,
      receivedTotal : user.directedAmount + user.distributedAmount + user.referralChainAmount
    }
    return result
  } catch (error) { throw error}
}

export const boxService = {
  openBox,
  approve,
  getDetail
}