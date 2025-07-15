import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
const minningGold = async (req, res, next) => {
  const correctCodition = Joi.object({
    sessionId : Joi.string().required().guid({ version: ['uuidv4'] }).messages({
      'any.required': 'SessionId là bắt buộc',
      'string.guid': 'SessionId không đúng định dạng',
      'string.empty': 'SessionId không được để trống'
    }),
    score: Joi.number().integer().min(0).max(500).required().messages({
      'any.required': 'Điểm là bắt buộc',
      'number.base': 'Điểm phải là số',
      'number.integer': 'Điểm phải là số nguyên',
      'number.min': 'Điểm không được nhỏ hơn 0',
      'number.max': 'Điểm quá cao, có thể gian lận'
    })
  }).strict()
  try {
    await correctCodition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) { next(error)}
}

const validNumber = async (req, res, next) => {
  const correctCodition = Joi.object({
    number: Joi.number().integer().min(0).max(100).required()
  }).strict()
  try {
    await correctCodition.validateAsync({ number: Number(req.params.number) }, { abortEarly: false })
    next()
  } catch (error) { throw new ApiError(StatusCodes.BAD_REQUEST, 'Thông điệp không phù hợp với số yêu cầu')}
}
export const miningGoldValidation = {
  minningGold,
  validNumber
}
