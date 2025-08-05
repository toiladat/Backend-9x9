import { userService } from '~/services/userService'

const { StatusCodes } = require('http-status-codes')
const { numerologymodel } = require('~/models/numerologyModel')
const { calculateLifePathNumber } = require('~/utils/caculateDob')

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