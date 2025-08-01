const { StatusCodes } = require('http-status-codes')
const { numerologymodel } = require('~/models/numerologyModel')
const { calculateLifePathNumber } = require('~/utils/caculateDob')

//[POST]/numerology/numerology
const numerology = async (req, res, next) => {
  try {
    const { birth, name } = req.body
    const number = calculateLifePathNumber(birth)
    console.log('🚀 ~ numerologyController.js:10 ~ numerology ~ number:', number.mainNumber)
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