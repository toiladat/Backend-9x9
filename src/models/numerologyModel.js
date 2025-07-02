import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const NUM_COLLECTION_NAME = 'numerologies';
const NUM_COLLECTION_SCHEMA = Joi.object({
  number: Joi.number().integer().min(1).max(22).required(),
  lifePath: Joi.string().trim().strict().required(),
  destiny: Joi.string().trim().strict().required(),
  body: Joi.string().trim().strict().required(),
  personality: Joi.string().trim().strict().required(),
  soul: Joi.string().trim().strict().required(),
  description: Joi.string().trim().strict().required()
})

const getMeanings = async (number) => {
  return await GET_DB().collection(NUM_COLLECTION_NAME).findOne({ number })
}

export const numerologymodel = {
  NUM_COLLECTION_NAME,
  NUM_COLLECTION_SCHEMA,
  getMeanings
}