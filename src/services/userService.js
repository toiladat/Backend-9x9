/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { EMAIL_HTML, EMAIL_SUBJECT } from '~/utils/constants'
import slugify from '~/utils/formatters'
import sendVerificationEmail from '~/utils/mailer'

const createNew = async (reqBody) => {
  try {
    const createdUser= await userModel.createNew(reqBody)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  }
  catch (error) {
    throw error
  }
}

const getUser = async (address) => {
  try {

    const userInfor = await userModel.getUser(address)
    if (!userInfor) {
      throw ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return userInfor
  } catch (error) { throw error }
}

const updateUserByAddress = async (data) => {
  try {
    return await userModel.findUserAndUpdate(data)
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
    const { address, kycOtp } = data
    const user = await userModel.findUserByAddress(address)
    if ( user && user.kycOtp === kycOtp) {
      return await userModel.findUserAndUpdate({
        address,
        isKyc: true
      })
    }
    return null
  } catch (error) { throw error}
}

export const userService = {
  createNew,
  getUser,
  updateUserByAddress,
  checkExistEmail,
  verifyKyc,
  requestKyc
}
