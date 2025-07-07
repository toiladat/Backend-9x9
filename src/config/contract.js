// Importing the ethers.js library for Ethereum blockchain interaction
require('dotenv').config()
const ethers = require('ethers')

// Configuration for QuickNode endpoint and user's private key
const endPoint = 'https://arbitrum-sepolia.infura.io/v3/0b05e002a0c146fe943f9ad523d04bda'

const QUICKNODE_ENDPOINT = process.env.HTTP_PROVIDER_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

// Setting up the provider and signer to connect to the Ethereum network via QuickNode
const provider = new ethers.JsonRpcProvider(QUICKNODE_ENDPOINT)
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const userAddress = signer.address

// Contract details: WETH contract on the Sepolia test network
const contractAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
const contractABI = [
  // ABI definitions for interacting with the contract
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  }
]

// Instantiating the contract object for interacting with the WETH contract
const contract = new ethers.Contract(contractAddress, contractABI, provider)
const contractWithSigner = contract.connect(signer)

// Reading from the contract
// READ FUNCTION WILL BE HERE

// Writing to the contract
// WRITING FUNCTION WILL BE HERE