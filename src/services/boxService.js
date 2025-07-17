import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const openBox = async (transaction) => {
  try {
    const address = transaction.args[0]
    const numbBox = Number(transaction.args[1])
          // check số box vừa mở xem có khác openBoxHistories.size không nếu thỏa mãn thì add time vào, push thêm 1 object defaul vào openhistory
    const user =await userModel.findUserByAddress()
    if (user.openBoxHistories.size() +1 !== numbBox)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')
    await userModel.updateUserByAdderss({
      address,
      openBoxHistories: [... user.openBoxHistories.push({ time: Date.now() })]
    })
      // lúc ký ví là add thêm vào invite người mời ở số box đó

    // cập nhật status là open, từ thằng cha trực tiếp mời trong invitedBy sau đó update cho address vừa mở là true

    // chia tiền theo cây vinterchain
    return []
  } catch (error) {
    throw error
  }
}

export const boxService = {
  openBox
}