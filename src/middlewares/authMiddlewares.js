import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  // const whiteLists = ['/', '/auth', '/']
  // if (whiteLists.some(item => `/api${item}` === req.originalUrl)) {
  //   return next()
  // }
  const authHeader = req.headers?.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Token is not valid or empty'
    })
  }
  const token = authHeader.split(' ')[1]
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.decoded=decoded
    return next()
  } catch (err) {
    next(err)
  }
}
const isKyc = (req, res, next) => {
  if (req.decoded.isKyc) {
    return next()
  }
  return res.status(StatusCodes.FORBIDDEN).json({
    message: 'Please KYC before take action'
  })
}
export const authMiddlewares = {
  auth,
  isKyc
}