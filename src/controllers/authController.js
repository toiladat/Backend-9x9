import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { jwtUtils } from '~/utils/jwt'

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

    res.cookie('refreshToken9x9', result.refreshToken, {
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


//[POST] /auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    // Nhận refresh token từ cookie hoặc body
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Yêu cầu refresh token')
    }

    const result = await authService.refreshAccessToken(refreshToken)
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }

    res.cookie('refreshToken9x9', result.newRefreshToken, options)
    res.cookie('accessToken9x9', result.newAccessToken, options)

    if (process.env.BUILD_MODE === 'dev') {
      res.status(StatusCodes.OK).json({
        success: true,
        accessToken: result.newAccessToken,
        refreshToken: result.newRefreshToken
      })
    } else {
      res.status(StatusCodes.OK).json({ success: true })
    }
  } catch (error) {
    next(error)
  }
}

//[POST] /auth/logout
const logout = async (req, res, next) => {
  try {
    const decoded =await jwtUtils.verifyToken(req.cookies.refreshToken9x9, process.env.REFRESH_TOKEN_SECRET)
    await authService.updateRefreshToken({ address: decoded.address, refreshToken: null })
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
    res.clearCookie('authData', options)
    res.clearCookie('refreshToken9x9', options)
    res.status(StatusCodes.OK).json({ success:true })
  } catch (error) { next(error)}
}
export const authController = {
  getNonce,
  login,
  refreshToken,
  logout
}
