/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { EMAIL_HTML, EMAIL_SUBJECT } from '~/utils/constants'
import slugify from '~/utils/formatters'
import sendVerificationEmail from '~/utils/mailer'
import { jwtUtils } from '~/utils/jwt'

const createNew = async (reqBody) => {
  try {
    const createdUser= await userModel.createUser(reqBody)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  }
  catch (error) {
    throw error
  }
}


const updateUserByAddress = async (data) => {
  try {
    return await userModel.updateUserByAdderss(data)
  } catch (error) { throw error }
}

const checkExistEmail = async (email) => {
  try {
    return !!(await userModel.findUserByEmail(email))
  } catch (error) { throw error}
}

const requestKyc = async (data) => {
  try {
    const updatedUser= await updateUserByAddress(data)
    if (updatedUser) {
      //Send email
      await sendVerificationEmail(
        updatedUser.email,
        EMAIL_SUBJECT,
        EMAIL_HTML(data.kycOtp)
      )
      return updatedUser
    }
    return null
  } catch (error) { throw error}
}

const verifyKyc = async (data) => {
  try {

    // Prepare token payload
    const tokenPayload = {
      address: data.address,
      isKyc: true
    }
    // Generate tokens
    const accessToken = await jwtUtils.generateToken(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE || '15m'
    )

    const user = await userModel.updateUserByAdderss({
      address: data.address,
      email:data.email,
      isKyc:true
    })
    return { accessToken, user }
  } catch (error) { throw error}
}

const getUsers = async (pagination, filter, options) => {
  try {
    return await userModel.getUsers(pagination, filter, options)
  } catch (error) { throw error}
}

const getMe = async (address) => {
  try {
    const result = await userModel.findUserByAddress(address)
    delete result.resfreshToken
    return result
  } catch (error) { throw error}
}
export const userService = {
  createNew,
  updateUserByAddress,
  checkExistEmail,
  verifyKyc,
  requestKyc,
  getUsers,
  getMe
}
