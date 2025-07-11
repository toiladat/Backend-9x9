// config/contractInstance.js
import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { contractABI } from './abi.js'
import { Network, Alchemy } from 'alchemy-sdk'

dotenv.config()

let contractRead = null
let contractWrite = null
let signer = null

export const CONNECT_CONTRACT = async () => {
  try {

    const settings = {
      apiKey: process.env.ALCHEMY_KEY,
      network: Network.ETH_SEPOLIA
    }
    const alchemy = new Alchemy(settings)

    // Lấy provider từ Alchemy
    const provider = await alchemy.config.getProvider()
    const PRIVATE_KEY = process.env.PRIVATE_KEY

    signer = new ethers.Wallet(PRIVATE_KEY, provider)

    const contractAddress = process.env.CONTRACT_ADDRESS

    contractRead = new ethers.Contract(contractAddress, contractABI, provider)
    contractWrite = contractRead.connect(signer)

    console.log('Kết nối thành công tới Smart Contract')
  } catch (error) {
    console.error('[Contract] ❌ Lỗi kết nối contract:', error.message)
  }
}

export const GET_CONTRACT =async () => {
  if (!contractRead || !contractWrite || !signer) {
    throw new Error('Phải kết nối contract trước!')
  }
  return {
    contractRead,
    contractWrite,
    signer
  }
}
