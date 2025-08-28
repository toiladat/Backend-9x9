import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { contractABI } from './abi.js'

dotenv.config()

let contractRead = null
let contractWrite = null
let signer = null
let provider = null
export const CONNECT_CONTRACT = async () => {
  try {
    provider = new ethers.JsonRpcProvider('https://bnb-mainnet.g.alchemy.com/v2/FJVO6TUmIb5ytV398zp5qww6BOJfB8mK')

    contractRead = new ethers.Contract(
      '0xA8a96BCc4e9f8423555a5F16C67D2562a1D328B5',
      contractABI,
      provider
    )
    signer = new ethers.Wallet(process.env.OWNER_CONTRACT_KEY, provider)
    contractWrite = contractRead.connect(signer)
    console.log('Kết nối thành công tới Smart Contract')
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error)
    throw error
  }
}

export const GET_CONTRACT =async () => {
  if (!contractRead || !contractWrite || !signer || !provider) {
    throw new Error('Phải kết nối contract trước!')
  }
  return {
    contractRead,
    contractWrite,
    signer,
    provider
  }
}
