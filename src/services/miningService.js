import { userModel } from '~/models/userModel'

const { miningHistoriesModel } = require('~/models/miningModel')

const create = async( { address, score }) => {
  try {
    const userExists = await userModel.findUserByAddress(address)
    if (!userExists) {
      return null
    }
    //Update users collection
    await userModel.updateUserByAdderss({ address, score: score + userExists.score })
    //create mining document
    const newHistory = await miningHistoriesModel.createHistory({ address: userExists.address, score })
    return await miningHistoriesModel.findOneById(newHistory.insertedId)
  } catch (error) { throw error}}


export const miningService = {
  create
}