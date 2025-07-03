import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'

const login = async (reqBody) => {
  const { address, signature, message } = reqBody
  try {

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    if ( recoveredAddress.toLowerCase() !== address.toLowerCase()) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Signature do not match message')

    // Check exist user
    let user = await userModel.findUserByAddress(address)
    if (! user) {
      const createdUser= await userModel.createUser({ address })
      user = await userModel.findOneById(createdUser.insertedId)
    }
    delete user._destroy
    // JWT token
    const token = jwt.sign(
      { address, isKyc: user.isKyc },
      process.env.JWT_SECRET,
      { expiresIn:process.env.JWT_EXPIRES }
    )
    return {
      user,
      accessToken: token
    }
  } catch (error) { throw error }
}

export const authService = {
  login
}