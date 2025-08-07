import { StatusCodes } from 'http-status-codes'
import { messageModel } from '~/models/messageModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { getDayDiff } from '~/utils/getDayDiff'
import { recoverRestTimes } from '~/utils/recoverRestTimes'

import { miningHistoriesModel } from '~/models/miningHistoriesModel'

const create = async( { address, score }) => {
  try {
    const user = await userModel.findUserByAddress(address)

    if (user.restTimes <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Bạn đã hết lượt chơi!')
    }
    const now = new Date()
    const lastPlay = new Date(user.lastPlayedTime || now)

    // Tính số ngày chênh lệch
    const dayDiff = getDayDiff(lastPlay, now)
    let continuousPlayDay = user.continuousPlayDay || 1

    if (dayDiff === 1) {
      continuousPlayDay += 1
    } else if (dayDiff > 1) {
      continuousPlayDay = 1
    }

    //Update users collection
    await userModel.updateUserByAdderss({
      address,
      score: score + user.score,
      restTimes: user.restTimes -1,
      lastPlayedTime: Date.now(),
      continuousPlayDay
    })
    //create mining document
    const newHistory = await miningHistoriesModel.createHistory({ address: address, score })
    return await miningHistoriesModel.findOneById(newHistory.insertedId)
  } catch (error) { throw error}}

const getRestTimes = async (address) => {
  try {
    const user = await userModel.findUserByAddress(address)
    const recovered = recoverRestTimes(user)
    if (
      recovered.restTimes !== user.restTimes ||
      new Date(recovered.lastPlayedTime).getTime() !== new Date(user.lastPlayedTime).getTime()
    ) {
      await userModel.updateUserByAdderss({
        address,
        restTimes: recovered.restTimes,
        lastPlayedTime: recovered.lastPlayedTime
      })
    }
    return recovered
  } catch (error) {
    throw error
  }
}

const getMessage = async (number) => {
  try {
    return await messageModel.getMessage(number)
  } catch (error) { throw error }
}

export const miningService = {
  create,
  getRestTimes,
  getMessage
}