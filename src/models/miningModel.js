import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ADDRESS_RULE, UUID_V4_MESSAGE, UUID_V4_RULE } from '~/utils/Validator'
const MINING_HISTORY_COLLECTION_NAME = 'miningHistories'
const MINING_HISTORY_COLLECTION_SCHEMA= Joi.object({
  address: Joi.string().pattern(ADDRESS_RULE).required().trim().strict(),
  score: Joi.number().min(0).default(0),
  sessionId: Joi.string().pattern(UUID_V4_RULE).message(UUID_V4_MESSAGE),
  startTime: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  try {
    return await MINING_HISTORY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  } catch (error) { throw new Error(error)}
}
const createHistory = async ( data ) => {
  try {
    const validHistory = await validateBeforeCreate(data)
    return await GET_DB().collection(MINING_HISTORY_COLLECTION_NAME).insertOne(validHistory)
  } catch (error) { throw new Error(error)}
}
const findOneById = async (id) => {
  try {
    return await GET_DB().collection(MINING_HISTORY_COLLECTION_NAME).findOne({
      _id: new Object(id)
    })
  } catch (error) { throw new Error(error)}
}

const getMiningCount = async (address) => {
  try {
    return await GET_DB().collection(MINING_HISTORY_COLLECTION_NAME).countDocuments({ address })
  } catch (error) { throw new Error(error)}
}
export const miningHistoriesModel = {
  MINING_HISTORY_COLLECTION_NAME,
  MINING_HISTORY_COLLECTION_SCHEMA,
  createHistory,
  findOneById,
  getMiningCount
}
