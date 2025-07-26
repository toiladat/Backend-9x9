import { ethers } from 'ethers'

export const extractAddressesAndAmounts= (obj) => {
  const addresses = []
  const amounts = []

  const handleEntry = (entry) => {
    if (entry?.address && typeof entry.amount === 'number') {
      addresses.push(ethers.getAddress(entry.address))
      amounts.push(BigInt(Math.floor(entry.amount * 1e6)))
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
