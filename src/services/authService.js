import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { jwtUtils } from '~/utils/jwt'
import crypto from 'crypto'

const generateNonce = () => {
  return crypto.randomBytes(16).toString('hex')
}
const login = async (reqBody) => {
  const { address, signature, message } = reqBody
  try {
    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Chữ ký không khớp với thông điệp')
    }

    // Check exist user and update nonce
    let user = await userModel.findUserByAddress(address)

    if (!user) {
      const createdUser = await userModel.createUser({
        address,
        nonce: generateNonce(), // Generate new nonce for new user
        refreshToken: null // Initialize
      })

      user = await userModel.findOneById(createdUser.insertedId)
    } else {
      // Existing user - verify nonce
      if (user.nonce !== message) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Thông điệp không hợp lệ')
      }
      // Update nonce after each login for security
      await userModel.updateUserByAdderss({
        address,
        nonce: generateNonce()
      })
    }

    // Prepare token payload
    const tokenPayload = {
      address: user.address,
      isKyc: user.isKyc || false
    }

    // Generate tokens
    const accessToken = await jwtUtils.generateToken(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE || '15m'
    )

    const refreshToken = await jwtUtils.generateToken(
      { address },
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFE || '7d'
    )

    // Lưu refresh token vào database để có thể revoke sau này
    await userModel.updateUserByAdderss({
      address:user.address,
      refreshToken
    })

    return {
      user: {
        _id: user._id,
        address: user.address,
        isKyc: user.isKyc,
        nonce: user.nonce // Client cần nonce mới cho lần login tiếp theo
      },
      accessToken,
      refreshToken
    }
  } catch (error) {
    throw error
  }
}

const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = await jwtUtils.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    // Check if token exists in DB (prevent reuse)
    const user = await userModel.findOneById(decoded.userId)
    if (!user || !user.refreshToken !==refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token không tồn tại')
    }

    // Generate new access token
    const newAccessToken = await jwtUtils.generateToken(
      {
        userId: user._id,
        address: user.address,
        isKyc: user.isKyc
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE || '15m'
    )

    return { accessToken: newAccessToken }
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, error.message || 'Refresh token không hợp lệ hoặc hết hạn')
  }
}


export const authService = {
  login,
  refreshAccessToken,
  generateNonce
}