import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import { contractABI } from '~/config/abi'
import { GET_CONTRACT } from '~/config/contract'
import ApiError from '~/utils/ApiError'
import { boxService } from '~/services/boxService'

const openBox = async (req, res, next ) => {
  try {
    const transaction= req.transaction
    // check số box vừa mở xem có khác openBoxHistories.size không nếu thỏa mãn thì add time vào, push thêm 1 object defaul vào openhistory
    const result = await boxService.openBox(transaction)

      // lúc ký ví là add thêm vào invite người mời ở số box đó

    // cập nhật status là open, từ thằng cha trực tiếp mời trong invitedBy sau đó update cho address vừa mở là true

    // chia tiền theo cây vinterchain

    res.json({
      transaction
    })
  } catch (error) { next(error)}
}

export const boxController = {
  openBox
}
