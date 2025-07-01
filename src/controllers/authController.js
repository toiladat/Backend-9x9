import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import crypto from 'crypto'

//[GET] /auth/nonce/:address
export const getNonce = async (req, res, next) => {
  try {
    const nonce = crypto.randomBytes(16).toString('hex')
    res.status(StatusCodes.OK).json({
      nonce: nonce
    })
  } catch (error) { next(error)}
}

//[POST]/auth/login
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(StatusCodes.OK).json({ result })
  } catch (error) {next(error) }
}
export const authController = {
  getNonce,
  login
}