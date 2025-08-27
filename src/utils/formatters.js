import { getAddress, parseUnits } from 'ethers'
import { DIRECTED_AMOUNT_TYPE, DISTRIBUTED_AMOUNT_TYPE, REFERRAL_CHAIN_AMOUNT_TYPE, SYSTEM_AMOUNT_TYPE } from './constants'

export const formatParsedLog = (parsedLog, decimals = 18) => {

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

export const extractAddressesAndAmounts = (obj) => {
  const addresses = []
  const amounts = []

  const toWei = (amt) => {
    if (typeof amt === 'bigint') return amt// đã là wei
    if (typeof amt === 'number') return parseUnits(String(amt), 18) // số ETH -> wei (bigint)
    if (typeof amt === 'string') {
      // '2.5' => parseUnits; '1000000000000000000' (không dấu '.') => coi như wei
      return amt.includes('.') ? parseInt(amt, 18) : BigInt(amt)
    }
    throw new Error('Invalid amount type')
  }

  const handleEntry = (entry) => {
    if (!entry || !entry.address || entry.amount == null) return
    addresses.push(getAddress(entry.address)) // checksum
    amounts.push(toWei(entry.amount))
  }

  for (const key in obj) {
    const value = obj[key]
    if (Array.isArray(value)) value.forEach(handleEntry)
    else if (value && typeof value === 'object') handleEntry(value)
  }

  return { addresses, amounts } // amounts là mảng bigint, hợp với uint256[]
}

export const formatAddress = (address, end) => `${address?.slice(0, end)}...${address?.slice(-3)}`