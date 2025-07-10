import jwt from 'jsonwebtoken'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'

const generateToken = async (user, secretSignature, tokenLife) => {

  try {
    const token = await jwt.sign(
      user,
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife
      }
    )
    return token
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
  }
}

const verifyToken = async (token, secretKey) => {
  try {
    const decoded = await jwt.verify(token, secretKey, {
      algorithms: ['HS256']
    })
    return decoded
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message)
  }
}

export const jwtUtils = {
  generateToken,
  verifyToken
}