import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { DIRECTED_AMOUNT_VALUE, DISTRIBUTE_PER_USER, REFERRAL_CHAIN_AMOUNT_VALUE , DISTRIBUTED_AMOUNT_VALUE , SYSTEM_AMOUNT_VALUE, DESC_BOX  } from '~/utils/constants'

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
    // 5 U
    const referalChain = [
      user.invitedBy,
      ...user.inviterChain.slice(0, 8).map(address => address)
    ]

    const validReferalChain = await userModel.filterValidReferalAddress(referalChain, boxNumber)

    const distributedAmount = validReferalChain.length * DISTRIBUTE_PER_USER
    const remainingAmount = Math.round(
      (REFERRAL_CHAIN_AMOUNT_VALUE - distributedAmount) * 100
    ) / 100

    return {
      invitedBy: {
        address: user.invitedBy ||process.env.SYSTEM_ADDRESS,
        amount: DIRECTED_AMOUNT_VALUE
      },
      inviterChain: validReferalChain.map((user) => ({
        address: user.address,
        amount: DISTRIBUTE_PER_USER
      })),
      distributedLevelUser: {
        address: distributedUser.address,
        amount: DISTRIBUTED_AMOUNT_VALUE
      },
      system: {
        address: process.env.SYSTEM_ADDRESS,
        amount: SYSTEM_AMOUNT_VALUE + remainingAmount
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
      title: DESC_BOX[data.boxNumber],
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