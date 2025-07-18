import { StatusCodes } from 'http-status-codes'
import { messageModel } from '~/models/messageModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { recoverRestTimes } from '~/utils/recoverRestTimes'

const { miningHistoriesModel } = require('~/models/miningModel')

const create = async( { address, score }) => {
  try {
    const user = await userModel.findUserByAddress(address)

    if (user.restTimes <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Bạn đã hết lượt chơi!')
    }

    //Update users collection
    await userModel.updateUserByAdderss({
      address,
      score: score + user.score,
      restTimes: user.restTimes -1,
      lastUpdatedTime: Date.now()
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
      new Date(recovered.lastUpdatedTime).getTime() !== new Date(user.lastUpdatedTime).getTime()
    ) {
      await userModel.updateUserByAdderss({
        address,
        restTimes: recovered.restTimes,
        lastUpdatedTime: recovered.lastUpdatedTime
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