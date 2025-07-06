import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
const NUM_COLLECTION_NAME = 'numerologies'
const OBJECT_CONTENT = Joi.object({
  title:Joi.string().strict(),
  content: Joi.string().strict()
})
const NUM_COLLECTION_SCHEMA = Joi.object({
  number: Joi.number().integer().min(1).max(22).required(),
  description:Joi.string().required().trim().strict(),
  lifePath: Joi.array().items(OBJECT_CONTENT).default([]),
  destiny: Joi.array().items(OBJECT_CONTENT).default([]),
  body: Joi.array().items(OBJECT_CONTENT).default([]),
  personality: Joi.array().items(OBJECT_CONTENT).default([]),
  soul: Joi.array().items(OBJECT_CONTENT).default([])
})

const getMeanings = async (number) => {
  return await GET_DB().collection(NUM_COLLECTION_NAME)
    .findOne(
      { number: parseInt(number) },
      { projection: { _id: 0, number: 0 } }
    )
}

export const numerologymodel = {
  NUM_COLLECTION_NAME,
  NUM_COLLECTION_SCHEMA,
  getMeanings
}
