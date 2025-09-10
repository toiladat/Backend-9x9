import { StatusCodes } from 'http-status-codes'
import { numerologymodel } from '~/models/numerologyModel'
import { calculateNumerology } from '~/utils/caculateDob'

//[GET]/numerology/numerology
const numerology = async (req, res, next) => {
  try {
    const { birth, name } = req.query
    const number = calculateNumerology(birth, name)
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