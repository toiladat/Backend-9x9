import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import crypto from 'crypto'
import { otpCache } from '~/utils/otpCache'
import sendVerificationEmail from '~/utils/mailer'
import { EMAIL_HTML, EMAIL_SUBJECT } from '~/utils/constants'

//[PATCH]/user/kyc
const requestKyc = async (req, res, next) => {
  try {
    //Check unique email
    const emailUsedByUser = await userService.checkExistEmail(req.body.email)
    if (emailUsedByUser) return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Email is used by another user'
    })
    const data = {
      email: req.body.email,
      kycOtp: crypto.randomInt(100000, 999999).toString()
    }
    otpCache.set(req.decoded.address, data)
    await sendVerificationEmail(
      data.email,
      EMAIL_SUBJECT,
      EMAIL_HTML(data.kycOtp)
    )
    return res.status(StatusCodes.OK).json({
      message: 'OTP sent, please check your mailbox'
    })

  } catch (error) { next(error)}
}

//[PATCH]/user/verify-kyc
const verifyKyc = async (req, res, next) => {
  try {
    const address = req.decoded.address
    const kycOtp = req.body.kycOtp
    const cachedData = otpCache.get(address)
    if (!cachedData || !cachedData.email || String(cachedData.kycOtp) != String(kycOtp)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'No OTP data found, please start KYC process again.'
      })
    }

    const verifiedUser = await userService.verifyKyc(address)
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
    const cachedData = otpCache.get(address)

    if (!cachedData || !cachedData.email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'No OTP data found, please start KYC process again.'
      })
    }
    const newOtp = crypto.randomInt(100000, 999999).toString()
    const newData = {
      email: cachedData.email,
      kycOtp: newOtp
    }
    otpCache.set(address, newData)
    await sendVerificationEmail(
      newData.email,
      EMAIL_SUBJECT,
      EMAIL_HTML(newOtp)
    )

    return res.status(StatusCodes.OK).json({
      message: 'OTP re-sent, please check your mailbox'
    })
  } catch (error) {
    next(error)
  }
}


//[GET]/user/ranking
const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.pagination)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}
export const userController = {
  requestKyc,
  verifyKyc,
  resendOtp,
  getUsers
}
