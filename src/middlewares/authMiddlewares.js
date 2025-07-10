import { StatusCodes } from 'http-status-codes'
import { jwtUtils } from '~/utils/jwt'

const auth =async (req, res, next) => {
  // const whiteLists = ['/', '/auth', '/']
  // if (whiteLists.some(item => `/api${item}` === req.originalUrl)) {
  //   return next()
  // }
  const authHeader = req.headers?.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Token không hợp lệ hoặc để trống'
    })
  }
  const token = authHeader.split(' ')[1]
  try {
    // Verify token
    const decoded = await jwtUtils.verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    )
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
    message: 'Vui lòng KYC trước khi truy cập'
  })
}
export const authMiddlewares = {
  auth,
  isKyc
}