import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const MESSAGE_COLLECTION_NAME = 'messages'
const MESSAGE_COLLECTION_SCHEMA= Joi.object({
  number: Joi.number().min(1).max(100),
  name:Joi.string().trim().strict()
})

const getMessage = async (number) => {
  try {
    return await GET_DB().collection(MESSAGE_COLLECTION_NAME).findOne({
      number: parseInt(number)
    })
  } catch (error) { throw new Error(error)}
}
export const messageModel = {
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTION_SCHEMA,
  getMessage
}
