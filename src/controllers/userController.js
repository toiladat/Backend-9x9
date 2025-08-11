import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import crypto from 'crypto'
import { otpCache } from '~/utils/cache'
import sendVerificationEmail from '~/utils/mailer'
import { EMAIL_HTML, EMAIL_SUBJECT } from '~/utils/constants'
import { userModel } from '~/models/userModel'

//[PATCH]/user/kyc
const requestKyc = async (req, res, next) => {
  try {
    //Check unique email
    const emailUsedByUser = await userService.checkExistEmail(req.body.email)
    if (emailUsedByUser) return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Email đã tồn tại'
    })
    const user = await userModel.findUserByAddress(req.decoded.address)
    if (user && user.email) return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Tài khoản đã KYC'
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
      message: 'Đã gửi mã OTP, vui lòng kiểm tra email'
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
        message: 'Phiên OTP đã hết hạn, vui lòng bắt đầu lại quy trình KYC'
      })
    }

    const result = await userService.verifyKyc({ address, email: cachedData.email })
    otpCache.del(address)
    if (result.user) {
      return res.status(StatusCodes.OK).json(result)
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:'KYC thất bại'
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
        message: 'Có lỗi xảy ra, vui lòng bắt đầu lại quy trình KYC'
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
      message: 'Đã gửi mã OTP, vui lòng kiểm tra email'
    })
  } catch (error) {
    next(error)
  }
}

//[GET]/user/ranking
const getUsers = async (req, res, next) => {
  try {
    const filter = {
      _destroy: false,
      score: { $gt: 0 }
    }
    const options = { projection: { address:1, score:1 } }
    const result = await userService.getUsers(req.pagination, filter, options)
    const user = await userService.getMe(req.decoded.address)
    result.user = {
      me : user.address,
      score: user.score,
      rank: user.rank
    }

    return res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

//[GET]/user/get-me
const getMe = async(req, res, next) => {
  try {
    const result = await userService.getMe(req.decoded.address)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error)}
}

export const userController = {
  requestKyc,
  verifyKyc,
  resendOtp,
  getUsers,
  getMe
}
