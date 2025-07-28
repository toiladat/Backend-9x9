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
      amounts
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

export const boxController = {
  openBox,
  approve
}
