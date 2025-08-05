/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { BADGES, DESC_BOX, EMAIL_HTML, EMAIL_SUBJECT, ONE_YEAR } from '~/utils/constants'
import sendVerificationEmail from '~/utils/mailer'
import { jwtUtils } from '~/utils/jwt'
import { miningHistoriesModel } from '~/models/miningModel'

const createNew = async (reqBody) => {
  try {
    const createdUser= await userModel.createUser(reqBody)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  }
  catch (error) {
    throw error
  }
}

const updateUserByAddress = async (data) => {
  try {
    return await userModel.updateUserByAdderss(data)
  } catch (error) { throw error }
}

const checkExistEmail = async (email) => {
  try {
    return !!(await userModel.findUserByEmail(email))
  } catch (error) { throw error}
}

const requestKyc = async (data) => {
  try {
    const updatedUser= await updateUserByAddress(data)
    if (updatedUser) {
      //Send email
      await sendVerificationEmail(
        updatedUser.email,
        EMAIL_SUBJECT,
        EMAIL_HTML(data.kycOtp)
      )
      return updatedUser
    }
    return null
  } catch (error) { throw error}
}

const verifyKyc = async (data) => {
  try {

    // Prepare token payload
    const tokenPayload = {
      address: data.address,
      isKyc: true
    }
    // Generate tokens
    const accessToken = await jwtUtils.generateToken(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE || '15m'
    )

    const user = await userModel.updateUserByAdderss({
      address: data.address,
      email:data.email,
      isKyc:true
    })
    return { accessToken, user }
  } catch (error) { throw error}
}

const getUsers = async (pagination, filter, options) => {
  try {
    return await userModel.getUsers(pagination, filter, options)
  } catch (error) { throw error}
}

const getMe = async (address) => {
  try {
    const result = await userModel.findUserByAddress(address)
    delete result.refreshToken
    delete result.nonce
    result.openBoxHistories = result.openBoxHistories.map((history, idx) => ({
      ...history,
      description: DESC_BOX[idx],
      title: `Hộp ${idx+1}`
    }))
    result.currentBox = result.openBoxHistories.filter(history => history.open).length + 1
    result.amount = result.directedAmount + result.referralChainAmount + result.distributedAmount
    result.invitedCounts = await userModel.getInvitedUsers(address)
    result.rank = await userModel.getRank(result?.score) + 1
    return result
  } catch (error) { throw error}
}

const findAndUpdateBadge = async (address) => {
  try {
    const user = await userModel.findUserByAddress(address)
    const badges = []
    const now = Date.now()

    // 1. Đủ 100 lượt đào vàng
    const miningCount = await miningHistoriesModel.getMiningCount(address)
    if (miningCount >= 100 && !user.badges.includes(BADGES.FIRESTARTER)) {
      badges.push(BADGES.FIRESTARTER)
    }

    // 2. Đào liên tiếp 21 ngày
    if (user.continiousPlayDay >= 21 && !user.badges.includes(BADGES.SOWER)) {
      badges.push(BADGES.SOWER)
    }

    // 3. Mời được 9 người
    const invitedCount = await userModel.getInvitedUsers(address)
    if (invitedCount >= 9 && !user.badges.includes(BADGES.GUIDE)) {
      badges.push(BADGES.GUIDE)
    }

    // 4. Trong top 9 điểm cao
    const topUsers = await userModel.getTopUsersByScore(9)
    if (topUsers.includes(address) && !user.badges.includes(BADGES.INSPIRER)) {
      badges.push(BADGES.INSPIRER)
    }

    // 5. Gắn bó hơn 1 năm
    const joinTime = new Date(user.createdAt).getTime()
    if (now - joinTime >= ONE_YEAR && !user.badges.includes(BADGES.AMBASSADOR)) {
      badges.push(BADGES.AMBASSADOR)
    }

    return badges.length > 0 ? await userModel.updateBadge(address, badges) : null
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  updateUserByAddress,
  checkExistEmail,
  verifyKyc,
  requestKyc,
  getUsers,
  getMe,
  findAndUpdateBadge
}
