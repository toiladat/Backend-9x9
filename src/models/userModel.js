import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ADDRESS_RULE } from '~/utils/Validator'
import { ObjectId } from 'mongodb'
import { MAX_PLAY_TIMES } from '~/utils/constants'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
  address: Joi.string().pattern(ADDRESS_RULE).required().trim().strict(),
  nonce: Joi.string().length(32).hex(),
  isKyc: Joi.boolean().default(false),
  name: Joi.string().optional().min(10).max(10).trim().strict(),
  email: Joi.string().optional().email().trim().strict(),
  score: Joi.number().min(0).default(0),
  restTimes: Joi.number().min(0).max(MAX_PLAY_TIMES).default(MAX_PLAY_TIMES).strict(),
  lastUpdatedTime: Joi.date().timestamp('javascript').default(null),
  invitedBy: Joi.string().required().pattern(ADDRESS_RULE).trim().strict(),
  inviterChain: Joi.array().items(Joi.string().pattern(ADDRESS_RULE)).max(9).default([]),
  amount: Joi.number().min(0).default(0),
  openBoxHistories: Joi.array()
    .items(Joi.object({
      boxNumber: Joi.number().integer().min(1).max(9).required(),
      time: Joi.date().timestamp('javascript').required().default(null),
      open: Joi.boolean().default(false)
    }))
    .max(9)
    .default(Array.from({ length: 9 }, (_, i) => ({
      boxNumber: i + 1,
      time:null,
      open:false
    }))),
  createdAt: Joi.date().timestamp('javascript').default(new Date()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
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


const openBox = async (address, boxNumber) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      {
        address: address
      },
      {
        $set: {
          'openBoxHistories.$[history].open': true,
          'openBoxHistories.$[history].time': new Date()
        }
      },
      {
        arrayFilters: [
          { 'history.boxNumber': boxNumber }
        ],
        returnDocument: 'after'
      }
    )
    return result.value
  } catch (error) {
    throw error
  }
}

const transferToDirectInviter = async ( invitedAddress, addressInviter ) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      {
        address: addressInviter
      },
      {
        $inc: { amount: 10.55 }
      },
      {
        returnDocument: 'after'
      }
    )
    return result.value
  } catch (error) { throw error}
}

const transferToInviterChain =async (inviters) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateMany(
      { address: { $in: inviters } },
      { $inc: { amount: 0.55 } }
    )
    return result.modifiedCount
  } catch (error) { throw error}
}

const transferToInviterLevel = async (inviterAddress, boxNumber) => {
  try {

    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne(
      { address: inviterAddress },
      { projection: { openBoxHistories: 1 } }
    )
    const shouldUpdateAvailable = user?.openBoxHistories?.find(
      history => history.boxNumber === boxNumber && history.open === true
    )
    let inviterWallet, systemWallet

    if (shouldUpdateAvailable) {
      inviterWallet = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
        { address: inviterAddress },
        { $inc: { amount: 10 } }
      )
    } else {
      systemWallet = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
        { address: 'addressSysem' },
        { $inc: { amount: 10 } }
      )
    }
    return {
      userModified: inviterWallet?.modifiedCount || 0,
      systemModified: systemWallet?.modifiedCount || 0,
      shouldUpdateAvailable
    }
  } catch (error) { throw error }
}

const transferToSystemWallet = async (restMoney) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { address: 'addressSystem' },
      { $inc: { amount: 1 + restMoney } }
    )
    return result.modifiedCount
  } catch (error) { throw error }
}

const findDistributedUser = async (inviterAddress, boxNumber) => {
  try {
    const db = GET_DB().collection(USER_COLLECTION_NAME)
    const addressToCheck = inviterAddress

    const user = await db.findOne(
      { address: addressToCheck },
      { projection: { openBoxHistories: 1, address: 1 } }
    )
    const isBoxOpened = user?.openBoxHistories?.some(
      history => history.boxNumber === boxNumber && history.open === true
    )

    return isBoxOpened ? user : { address: process.env.SYSTEM_ADDRESS }
  } catch (error) {
    throw error
  }
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
  updateUserByAdderss,
  openBox,
  transferToDirectInviter,
  transferToInviterChain,
  transferToInviterLevel,
  transferToSystemWallet,
  findDistributedUser
}
