import { boxService } from '~/services/boxService'

const openBox = async (req, res, next ) => {
  try {
    const transaction= req.transaction
    const address = req.decoded.address
    // check số box vừa mở xem có khác openBoxHistories.size không nếu thỏa mãn thì add time vào, push thêm 1 object defaul vào openhistory
    const result = await boxService.openBox(address, transaction)

    res.json({
      transaction
    })
  } catch (error) { next(error)}
}

export const boxController = {
  openBox
}
