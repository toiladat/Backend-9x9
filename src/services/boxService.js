import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const openBox = async (address, transaction) => {
  try {
    const numBox = transaction.args.numBox
    // check số box vừa mở xem có khác openBoxHistories.size không nếu thỏa mãn thì add time vào, push thêm 1 object defaul vào openhistory
    // chuyển 1 pending -> available
    const user =await userModel.findUserByAddress(address)

    if (user.openBoxHistories.length +1 !== numBox)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box mở không phù hợp')
    // await userModel.openBox(address, numBox)
    // lúc ký ví là add thêm vào invite người mời ở số box đó

    // // cập nhật status là open, từ thằng cha trực tiếp mời trong invitedBy sau đó update cho address vừa mở là true
    // // cập nhật tiền cho cha trực tiếp 10 u
    // await userModel.transferToDirectInviter(address, user.invitedBy)

    // // chia tiền theo cây vinterchain
    // // 5 u cho 9 thằng trong inviterChain
    const restMoney = 5 - 0.55 * user.inviterChain
    // await userModel.transferToInviterChain(user.inviterChain)
    // // 10 u cho thằng tầng box ( ví dụ box 3 thì co thằng tầng 3) ( xử lý pending )
    await userModel.transferToInviterLevel(user.inviterChain[numBox - 1], numBox)
    //     //check neu box nó mở > = box mình đang mở thì cho vào available, còn không thì pending
    // // 1 u cho hệ thống

    return []
  } catch (error) {
    throw error
  }
}

export const boxService = {
  openBox
}