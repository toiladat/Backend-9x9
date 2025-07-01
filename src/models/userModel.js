import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ADRESS_RULE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/Validator'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
  address: Joi.string().pattern(ADRESS_RULE).required().trim().strict(),
  isKyc: Joi.boolean().default(false),
  kycOtp: Joi.string().length(6).trim().strict(),
  name:Joi.string().optional().min(10).max(10).trim().strict(),
  email: Joi.string().optional().email().trim().strict(),
  nationalId: Joi.string().optional().length(10).trim().strict(),
  history: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  try {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })

  } catch (error) {
    throw Error( error )
  }
}

const createUser = async (data) => {
  try {
    const validUser = await validateBeforeCreate(data)

    const createdNew= await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validUser)
    return createdNew
  }
  catch (err) { new Error(err) }
}


const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
      _destroy:false
    })
    return result
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

const findUserAndUpdate = async( data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      {
        address: data.address,
        _destroy:false
      },
      { $set: { ...data, updatedAt: new Date() } },
      {
        returnDocument: 'after',
        projection: { _destroy: 0 }
      }
    )
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
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createUser,
  findOneById,
  getUser,
  findUserAndUpdate,
  findUserByAddress,
  findUserByEmail
}