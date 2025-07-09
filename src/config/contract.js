// config/contractInstance.js
import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { contractABI } from './abi.js'

dotenv.config()

let contractRead = null
let contractWrite = null
let signer = null

export const CONNECT_CONTRACT = async () => {
  try {
    const QUICKNODE_ENDPOINT = process.env.HTTP_PROVIDER_URL
    const PRIVATE_KEY = process.env.PRIVATE_KEY

    const provider = new ethers.JsonRpcProvider(QUICKNODE_ENDPOINT)

    signer = new ethers.Wallet(PRIVATE_KEY, provider)

    const contractAddress = process.env.CONTRACT_ADDRESS

    contractRead = new ethers.Contract(contractAddress, contractABI, provider)
    contractWrite = contractRead.connect(signer)

    console.log('Kết nối thành công tới Smart Contract')
  } catch (error) {
    console.error('[Contract] ❌ Lỗi kết nối contract:', error.message)
  }
}

export const GET_CONTRACT = () => {
  if (!contractRead || !contractWrite || !signer) {
    throw new Error('Phải kết nối contract trước!')
  }
  return {
    contractRead,
    contractWrite,
    signer
  }
}
