import { ethers } from 'ethers'
import { DIRECTED_AMOUNT_TYPE, DISTRIBUTED_AMOUNT_TYPE, REFERRAL_CHAIN_AMOUNT_TYPE, SYSTEM_AMOUNT_TYPE } from './constants'

export const formatParsedLog = (parsedLog, decimals = 6) => {

  const addresses = parsedLog.args[2]
  const amounts = parsedLog.args[3]

  const rewards = addresses.map((addr, idx) => {
    let type = REFERRAL_CHAIN_AMOUNT_TYPE
    if ( idx === 0 ) type = DIRECTED_AMOUNT_TYPE
    else if ( idx === addresses.length - 1) type = SYSTEM_AMOUNT_TYPE
    else if (addresses.length > 2 && idx === addresses.length -2 ) type = DISTRIBUTED_AMOUNT_TYPE

    return {
      address: addr.toLowerCase(),
      amount: Number(amounts[idx]) / 10 ** decimals,
      type
    }
  })

  return {
    opener: parsedLog.args[0].toLowerCase(),
    boxNumber: Number(parsedLog.args[1]),
    rewards
  }
}

export const extractAddressesAndAmounts= (obj) => {
  const addresses = []
  const amounts = []

  const handleEntry = (entry) => {
    if (entry?.address && typeof entry.amount === 'number') {
      addresses.push(ethers.getAddress(entry.address))
      amounts.push(entry.amount * 1e6)
    }
  }
  for (const key in obj) {
    const value = obj[key]
    if (Array.isArray(value)) {
      value.forEach(item => handleEntry(item))
    } else if (typeof value === 'object') {
      handleEntry(value)
    }
  }

  return { addresses, amounts }
}

export const formatAddress = (address, end) => `${address?.slice(0, end)}...${address?.slice(-3)}`