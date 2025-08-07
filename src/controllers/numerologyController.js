import { userService } from '~/services/userService'
import { StatusCodes } from 'http-status-codes'
import { numerologymodel } from '~/models/numerologyModel'
import { calculateLifePathNumber } from '~/utils/caculateDob'

//[GET]/numerology/numerology
const numerology = async (req, res, next) => {
  try {
    const { birth, name } = req.query
    const number = calculateLifePathNumber(birth)
    await userService.updateUserByAddress({
      address: req.decoded.address,
      name,
      mainNumber: number.mainNumber
    })
    const meaning = await numerologymodel.getMeanings(number.mainNumber)
    return res.status(StatusCodes.OK).json({
      name,
      number,
      meaning
    })

  } catch (error) { next(error)}
}

export const numerologyController = {
  numerology
}