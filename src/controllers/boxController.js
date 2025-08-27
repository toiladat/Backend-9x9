import { StatusCodes } from 'http-status-codes'
import { boxService } from '~/services/boxService'
import { ethers } from 'ethers'
import { extractAddressesAndAmounts } from '~/utils/formatters'
import { GET_CONTRACT } from '~/config/contract'
import { userService } from '~/services/userService'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

// [POST] /box/approve
const approve = async (req, res, next) => {
  try {
    const transaction = req.transaction
    const result = await boxService.approve(transaction)
    const { addresses, amounts } = extractAddressesAndAmounts(result)
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'uint8', 'address[]', 'uint256[]'],
      [transaction.address, transaction.boxNumber, addresses, amounts]
    )
    const messageHash =ethers.keccak256(encoded)
    const { signer } = await GET_CONTRACT()
    const signature = await signer.signMessage(ethers.getBytes(messageHash))
    res.status(StatusCodes.OK).json({
      signature,
      addresses,
      amounts: amounts.map(a => a.toString())
    })

  } catch (error) { next(error)}
}

// [POST] /box/open
const openBox = async (req, res, next ) => {
  try {
    const transaction= req.transaction
    const result = await boxService.openBox( transaction)
    const boxNumber = result.openBoxHistories.filter(history => history.open).length
    res.status(StatusCodes.OK).json({ success: true, boxNumber })
  } catch (error) { next(error)}
}

// [GET] /box/:boxNumber
const getDetail = async(req, res, next) => {
  try {
    const address = req.decoded.address
    const boxNumber = req.params.boxNumber
    if (boxNumber < 1 || boxNumber > 9 ) throw new ApiError(StatusCodes.BAD_REQUEST, 'Số Box không hợp lệ')
    const result = await boxService.getDetail({ address, boxNumber })
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error)}
}

// [GET] /box/tree
const getTree = async (req, res, next) => {
  try {
    const address = req.query.address|| req.decoded.address
    const user = await userModel.findUserByAddress(address)
    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, 'Địa chỉ không tồn tại')
    const filter = { spillover: address, _destroy: false }
    const options = { projection: { address: 1 } }
    const result = await userService.getUsers(req.pagination, filter, options)
    res.status(StatusCodes.OK).json({
      result
    })
  } catch (error) { next(error)}
}

export const boxController = {
  openBox,
  approve,
  getDetail,
  getTree
}
