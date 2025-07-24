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

    const recoveredAddress = ethers.verifyMessage(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Chữ ký không khớp với thông điệp')
    }

    let user = await userModel.findUserByAddress(address)

    if (!user) {
      const inviter = await userModel.findUserByAddress('0xc30a8e1ad70acd22c6350ba9d74e09f05574f672')

      if (!inviter) throw new ApiError(StatusCodes.BAD_REQUEST, 'Không tồn tại địa chỉ ví người mời')

      const createdUser = await userModel.createUser({
        address,
        invitedBy: inviter.address,
        refreshToken: null,
        inviterChain: [
          ...(inviter?.invitedBy ? [inviter.invitedBy] : []),
          ...inviter.inviterChain.slice(0, 8)
        ]
      })
      user = await userModel.findOneById(createdUser.insertedId)
    }
    else if (user?.nonce !== message) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Vui lòng ký trên thông điệp mới nhất')
    }

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

    await userModel.updateUserByAdderss({
      address:user.address,
      nonce: generateNonce(),
      refreshToken
    })

    return {
      user: {
        _id: user._id,
        address: user.address,
        isKyc: user.isKyc
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
    const decoded = await jwtUtils.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await userModel.findUserByAddress(decoded.address)
    if ( user.refreshToken !== refreshToken) {
      await updateRefreshToken({ address: user.address, refreshToken: null })
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token không hợp lệ')
    }

    const newAccessToken = await jwtUtils.generateToken(
      {
        userId: user._id,
        address: user.address,
        isKyc: user.isKyc
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE || '15m'
    )

    const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000)

    const newRefreshToken = await jwtUtils.generateToken(
      { address: user.address },
      process.env.REFRESH_TOKEN_SECRET,
      expiresInSeconds
    )

    await updateRefreshToken({
      address: user.address,
      refreshToken: newRefreshToken
    })

    return { newAccessToken, newRefreshToken }

  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, error.message || 'Refresh token không hợp lệ hoặc đã hết hạn')
  }
}

const updateRefreshToken = async (data) => {
  try {
    const { address, refreshToken } = data
    return await userModel.updateUserByAdderss({ address, refreshToken })
  } catch (error) { throw error}
}

export const authService = {
  login,
  refreshAccessToken,
  generateNonce,
  updateRefreshToken
}
