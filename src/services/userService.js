/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { BADGES, DESC_BOX, EMAIL_HTML, EMAIL_SUBJECT, ONE_YEAR } from '~/utils/constants'
import sendVerificationEmail from '~/utils/mailer'
import { jwtUtils } from '~/utils/jwt'
import { miningHistoriesModel } from '~/models/miningHistoriesModel'
import { getDayDiff } from '~/utils/getDayDiff'

const updateUserByAddress = async (data, option ) => {
  try {
    return await userModel.updateUserByAddress(data, option)
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

    const user = await userModel.updateUserByAddress({
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
    const user = await userModel.findUserByAddress(address)
    const { refreshToken, nonce, ...safeUser } = user

    const openBoxHistories = safeUser.openBoxHistories.map((history, idx) => ({
      ...history,
      description: DESC_BOX[idx],
      title: `Hộp ${idx + 1}`
    }))

    const [
      invitedCounts,
      rank,
      comunity
    ] = await Promise.all([
      userModel.getInvitedUsers(address),
      userModel.getRank(safeUser),
      userModel.getCommunity(safeUser.address)
    ])

    return {
      ...safeUser,
      openBoxHistories,
      currentBox: openBoxHistories.filter(h => h.open).length + 1,
      amount: safeUser.directedAmount + safeUser.referralChainAmount + safeUser.distributedAmount,
      invitedCounts,
      rank: rank + 1,
      journey: getDayDiff(new Date(safeUser.createdAt), new Date()),
      comunity
    }
  } catch (error) {
    throw error
  }
}

const findAndUpdateBadge = async (address) => {
  try {
    const user = await userModel.findUserByAddress(address)
    const badges = []
    const now = Date.now()

    // 1. Đủ 100 lượt đào vàng
    const miningCount = await miningHistoriesModel.getMiningCount({ address })
    if (miningCount >= 100 && !user.badges.includes(BADGES.FIRESTARTER)) {
      badges.push(BADGES.FIRESTARTER)
    }

    // 2. Đào liên tiếp 21 ngày
    if (user.continuousPlayDay >= 21 && !user.badges.includes(BADGES.SOWER)) {
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
  updateUserByAddress,
  checkExistEmail,
  verifyKyc,
  requestKyc,
  getUsers,
  getMe,
  findAndUpdateBadge
}
