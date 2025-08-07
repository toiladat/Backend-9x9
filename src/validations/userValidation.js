import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { ADDRESS_RULE, BIRTH_RULE } from '~/utils/Validator'
const createUser =async (req, res, next ) => {

  const correctCodition = Joi.object({
    email: Joi.string().required().email().trim().strict().messages({
      'any.required': 'Vui lòng nhập Email'
    }),
    cccd: Joi.string().required().length(10).trim().strict()
  }).strict()

  try {
    // abortEarly chỉ định nếu có lỗi thì trả về tất cả
    await correctCodition.validateAsync(req.body, { abortEarly:false })
    next()

  } catch (error) {
    const errorMessage= new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const login = async (req, res, next) => {
  const correctCodition = Joi.object({
    address: Joi.string().required().trim().strict().messages({
      'string.empty': 'Địa chỉ ví không được để trống',
      'any.required': 'Vui lòng gửi kèm địa chỉ ví'
    }),
    signature: Joi.string().required().trim().strict().messages({
      'string.empty': 'Chữ ký không được để trống',
      'any.required': 'Vui lòng gửi kèm chữ ký'
    }),
    message: Joi.string().required().trim().strict().messages({
      'string.empty': 'Thông điệp không được để trống',
      'any.required': 'Vui lòng gửi kèm thông điệp'
    }),
    invitedBy:Joi.string().optional().pattern(ADDRESS_RULE).trim().strict().messages({
      'string.pattern.base':'Địa chỉ ví người mời không hợp lệ'
    })
  }).strict()
  try {
    await correctCodition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) { next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)) }
}

const requestkyc = async (req, res, next) => {
  const correctCodition = Joi.object({
    email: Joi.string().email().required().trim().strict().messages({
      'any.required': 'Vui lòng nhập Email',
      'string.email': 'Email không được để trống'
    })
  })

  try {
    await correctCodition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyKyc = async (req, res, next) => {
  const correctCodition = Joi.object({
    kycOtp: Joi.string().required().length(6).trim().strict().messages({
      'any.required': 'Vui lòng nhập mã OTP',
      'string.empty': 'Mã OTP không được để trống',
      'string.length': 'Mã OTP phải có đúng 6 ký tự',
      'string.base': 'Mã OTP phải là chuỗi ký tự'
    })
  })

  try {
    await correctCodition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const numerology = async (req, res, next) => {
  const correctCodition = Joi.object({
    birth: Joi.string().required().pattern(BIRTH_RULE).trim().strict().messages({
      'any.required': 'Ngày sinh là bắt buộc',
      'string.empty': 'Vui lòng nhập ngày sinh',
      'string.pattern.base': 'Ngày sinh không hợp lệ'
    }),
    name:Joi.string().required().trim().strict().messages({
      'any.required': 'Họ tên là bắt buộc',
      'string.empty': 'Vui lòng nhập họ tên'

    })
  }).strict()

  try {
    await correctCodition.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const validMissionCompleted = async ( req, res, next) => {
  try {
    const correctCodition = Joi.object({
      shareLink: Joi.boolean().strict(),
      joinGroup: Joi.boolean().strict(),
      readTerms: Joi.boolean().strict()
    })
    await correctCodition.validateAsync(req.body?.missionCompleted, { abortEarly: false })
    next()
  } catch (error) { next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))}
}
export const userValidation = {
  createUser,
  login,
  requestkyc,
  verifyKyc,
  numerology,
  validMissionCompleted
}
