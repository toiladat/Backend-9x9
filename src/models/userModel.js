import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ADDRESS_RULE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/Validator'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
  address: Joi.string().pattern(ADDRESS_RULE).required().trim().strict(),
  nonce: Joi.string().length(32).hex().required(),
  isKyc: Joi.boolean().default(false),
  name:Joi.string().optional().min(10).max(10).trim().strict(),
  email: Joi.string().optional().email().trim().strict(),
  score: Joi.number().min(0).default(0),
  invitedBy: Joi.string().pattern(ADDRESS_RULE).trim().strict(),
  history: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false),
  refreshToken: Joi.string().allow(null).empty('').default(null)
})

const validateBeforeCreate = async (data) => {
  try {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })

  } catch (error) {
    throw new Error( error )
  }
}

const createUser = async (data) => {
  try {
    const validUser = await validateBeforeCreate(data)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validUser)
  }
  catch (err) { new Error(err) }
}

const findOneById = async(id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
      _destroy:false
    })
  } catch (error) { new Error(error)}
}

const getUser = async(id) => {
  try {

    //aggreate collection
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
      _destroy:false
    })

    return result
  } catch (error) { new Error(error)}
}


const findUserByAddress = async (address) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      address:address,
      _destroy:false
    })
  } catch (error) { new Error(error) }
}

const findUserByEmail = async(email) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email:email,
      _destroy:false
    })
  } catch (error) { new Error(error) }
}
const getUsers = async (pagination, filter, options ) => {
  try {
    const { limit, page, skip } = pagination

    const db = GET_DB().collection(USER_COLLECTION_NAME)
    const totalItems = await db.countDocuments({ _destroy: false })
    const users = await db.find(
      filter,
      options
    )
      .skip(skip)
      .limit(limit)
      .sort({ score: -1 })
      .toArray()
    const pageTotal = Math.ceil(totalItems / limit)
    return {
      users: users,
      pagination: {
        totalItems,
        page,
        limit,
        pageTotal
      }
    }
  } catch (error) { throw new Error(error)}
}


const updateUserByAdderss = async(data, options = { updateTimestamp: false }) => {

  try {
    const updatedData = { ...data }
    if (options.updateTimestamp)
      updatedData.updatedAt = new Date()
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { address: data.address },
      { $set: updatedData },
      {
        returnDocument: 'after',
        projection: { address: 1, email: 1, score: 1, history: 1, isKyc: 1 }
      }
    )
    return result
  } catch (error) { throw new Error(error) }
}


export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createUser,
  findOneById,
  getUser,
  findUserByAddress,
  findUserByEmail,
  getUsers,
  updateUserByAdderss
}