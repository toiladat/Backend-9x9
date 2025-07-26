import { StatusCodes } from 'http-status-codes'
import { boxService } from '~/services/boxService'
import { ethers } from 'ethers'
import { extractAddressesAndAmounts } from '~/utils/extractAddressesAndAmounts'
import { GET_CONTRACT } from '~/config/contract'

// [POST] /box/approve
const approve = async (req, res, next) => {
  try {
    const transaction = req.transaction
    const result = await boxService.approve(transaction)
    const { addresses, amounts } = extractAddressesAndAmounts(result)

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint8', 'address[]', 'uint256[]'],
      [transaction.address, transaction.boxNumber, addresses, amounts]
    )
    const { signer } = await GET_CONTRACT()
    const signature = await signer.signMessage(ethers.getBytes(messageHash))
    res.status(StatusCodes.OK).json({
      signature,
      messageHash
    })

  } catch (error) { next(error)}
}

// [POST] /box/open
const openBox = async (req, res, next ) => {
  try {
    const transaction= req.transaction
    // check số box vừa mở xem có khác openBoxHistories.size không nếu thỏa mãn thì add time vào, push thêm 1 object defaul vào openhistory
    const result = await boxService.openBox( transaction)
    res.json({
      transaction
    })
  } catch (error) { next(error)}
}

export const boxController = {
  openBox,
  approve
}
