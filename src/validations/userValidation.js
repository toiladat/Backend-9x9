import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BIRTH_RULE } from '~/utils/Validator'
const createUser =async (req, res, next ) => {

  const correctCodition = Joi.object({
    email: Joi.string().required().email().trim().strict().messages({
      'any.required': 'Email is required'
    }),
    cccd: Joi.string().required().length(10).trim().strict()
  })

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
      'any.required': 'Address is required'
    }),
    signature: Joi.string().required().trim().strict().messages({
      'any.required': 'Signature is required'
    }),
    message: Joi.string().required().trim().strict().messages({
      'any.required': 'message is required'
    })
  })
  try {
    await correctCodition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) { next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message)) }
}

const requestkyc = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict().messages({
      'any.required': 'Email is required',
      'string.email': 'Email must be a valid email'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyKyc = async (req, res, next) => {
  const correctCondition = Joi.object({
    kycOtp: Joi.string().required().length(6).trim().strict().messages({
      'any.required': 'OTP is required',
      'string.length':'OTP is not valid'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
const numerology = async (req, res, next) => {
  const correctCondition = Joi.object({
    birth: Joi.string().required().pattern(BIRTH_RULE).trim().strict().messages({
      'any.required': 'birth is required',
      'string.empty': 'birth cannot be empty',
      'string.pattern.base': 'birth is not valid'
    }),
    name:Joi.string().required().trim().strict().messages({
      'any.required': 'name is required',
      'string.empty': 'name cannot be empty'

    })
  }).strict()

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
export const userValidation = {
  createUser,
  login,
  requestkyc,
  verifyKyc,
  numerology
}
