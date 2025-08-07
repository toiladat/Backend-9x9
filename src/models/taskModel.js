import { GET_DB } from '~/config/mongodb'

import Joi from 'joi'
import { ADDRESS_RULE } from '~/utils/Validator'

const TASK_COLLECTION_NAME = 'tasks'
const TASK_COLLECTION_SCHEMA = Joi.object({
  address: Joi.string().pattern(ADDRESS_RULE).required().trim().strict(),
  miningTimes: Joi.number().integer().default(0).strict(),
  latestLoginDay: Joi.date().timestamp('javascript').default(null),
  continuousLoginDay: Joi.number().integer().default(1).strict(),

  claimByDay: Joi.array().items(Joi.number()).default([]),

  shareLink: Joi.boolean().default(false),
  joinGroup: Joi.boolean().default(false),
  readTerms: Joi.boolean().default(false)
})

const validateBeforeCreate = async( data) => {
  try {
    return await TASK_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  } catch (error) { throw new Error(error)}
}

const createTask = async( address ) => {
  try {
    const data = await validateBeforeCreate({ address } )
    return await GET_DB().collection(TASK_COLLECTION_NAME).insertOne( data)
  } catch (error) { throw new Error(error)}
}

const getTask = async( address) => {
  try {
    return await GET_DB().collection(TASK_COLLECTION_NAME).findOne({ address })
  } catch (error) { throw new Error(error)}
}

const updateTask = async (data) => {
  try {
    return await GET_DB().collection(TASK_COLLECTION_NAME).findOneAndUpdate(
      { address: data.address },
      { $set: data },
      { returnDocument: 'after' }
    )
  } catch (error) { throw new Error(error)}
}

export const taskModel = {
  createTask,
  getTask,
  updateTask
}
