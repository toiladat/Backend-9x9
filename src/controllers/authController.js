import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import { userModel } from '~/models/userModel'
import { jwtUtils } from '~/utils/jwt'
import ApiError from '~/utils/ApiError'
import { TOKEN_NAME } from '~/utils/constants'

//[GET] /auth/nonce/:address
export const getNonce = async (req, res, next) => {
  try {
    const user = await userModel.findUserByAddress(req.params.address)
    const nonce = user ? user.nonce : authService.generateNonce()
    res.status(StatusCodes.OK).json({
      nonce: nonce
    })
  } catch (error) { next(error)}
}

//[POST]/auth/login
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    // Set HTTP-only secure cookie for refresh token


    res.cookie(TOKEN_NAME, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })


    // Trả về thông tin user và access token (không trả về refresh token)
    res.status(StatusCodes.OK).json({
      user: result.user,
      accessToken: result.accessToken
    })
  } catch (error) {next(error) }
}


// [POST] /auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    // Nhận refresh token từ cookie hoặc body
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token is required')
    }

    // Verify token
    const decoded = await jwtUtils.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    // Kiểm tra trong database
    const user = await userModel.findUserByAddress(decoded.address)
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    // Tạo access token mới
    const newAccessToken = await jwtUtils.generateToken(
      {
        userId: user._id,
        address: user.address,
        isKyc: user.isKyc
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE || '15m'
    )

    // Trả về access token mới
    res.status(StatusCodes.OK).json({
      accessToken: newAccessToken
    })

  } catch (error) {
    next(error)
  }
}

export const authController = {
  getNonce,
  login,
  refreshToken
}