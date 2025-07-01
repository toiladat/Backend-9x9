import { ethers } from 'ethers'
import { StatusCodes } from 'http-status-codes'
const isAddressValid = (req, res, next) => {
  if ( ! ethers.isAddress(req.params.address)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message:'Address is not valid'
    })
  }
  next()
}

export const addressValidation = {
  isAddressValid
}