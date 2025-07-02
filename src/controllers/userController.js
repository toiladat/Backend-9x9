import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { calculateLifePathNumber } from '~/utils/caculateDob'
import { numerologymodel } from '~/models/numerologyModel'

//[PATCH]/user/kyc
const requestKyc = async (req, res, next) => {
  try {
    //Check unique email
    const emailUsedByUser = await userService.checkExistEmail(req.body.email)
    if (emailUsedByUser) res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Email is used by another user'
    })
    const data = {
      address: req.decoded.address,
      email: req.body.email,
      kycOtp: crypto.randomInt(100000, 999999).toString()
    }
    const isKyc = await userService.requestKyc(data)
    if ( isKyc) {
      return res.status(StatusCodes.OK).json({
        message: 'OTP sent, please check your mailbox'
      })
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Action again'
    })

  } catch (error) { next(error)}
}

//[PATCH]/user/verify-kyc
const verifyKyc = async (req, res, next) => {
  try {
    const address = req.decoded.address
    const kycOtp = req.body.kycOtp
    const verifiedUser = await userService.verifyKyc({ address, kycOtp })
    if (verifiedUser) {
      return res.status(StatusCodes.OK).json({
        message:'KYC successfully'
      })
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:'KYC failed'
    })

  } catch (error) { next(error) }
}

//[PATCH]/user/resend-otp
const resendOtp = async (req, res, next) => {
  try {
    const address = req.decoded.address
    const data = {
      address,
      kycOtp: crypto.randomInt(100000, 999999).toString()
    }

    const isKyc = await userService.requestKyc(data)
    if ( isKyc) {
      return res.status(StatusCodes.OK).json({
        message: 'OTP sent, please check your mailbox'
      })
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Action again'
    })

  } catch (error) { next(error) }
}

//[POST]/user/numerology
const numerology = async (req, res, next) => {
  try {
    const { birth, name } = req.body
    const number = calculateLifePathNumber(birth)
    const meaning = await numerologymodel.getMeanings(number)
    return res.status(StatusCodes.OK).json({
      name,
      number,
      meaning
    })

  } catch (error) { next(error)}
}

export const userController = {
  requestKyc,
  verifyKyc,
  resendOtp,
  numerology
}
