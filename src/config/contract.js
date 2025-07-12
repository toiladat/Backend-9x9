import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { contractABI } from './abi.js';

dotenv.config();

// Biến lưu trữ contract instance
let contractRead = null;
let contractWrite = null;
let eventListener = null;

export const CONNECT_CONTRACT = async () => {
  try {
    // 1. Kết nối WebSocket Provider (bắt buộc để lắng nghe real-time)
    const provider = new ethers.WebSocketProvider(
      'wss://eth-sepolia.g.alchemy.com/v2/FJVO6TUmIb5ytV398zp5qww6BOJfB8mK'
    );

    // 2. Tạo contract instance
    contractRead = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      provider
    );

    // 3. Tạo signer cho giao dịch write
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contractWrite = contractRead.connect(signer);

    // 4. Lắng nghe sự kiện từ hàm write
    eventListener = contractRead.on('BoxPurchased', (address, numBox, priceBox) => {
      console.log(`📦 User ${address} vừa mở hộp với ${numBox} `);

      console.log('Chi tiết:', priceBox);
      
    });

    console.log('✅ Đã bắt đầu lắng nghe sự kiện BoxOpened');
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error);
    throw error;
  }
};

// Hàm xử lý khi nhận được sự kiện
const processDeposit = (user, amount, txHash) => {
  // Gọi API backend hoặc lưu vào database
  fetch('/api/deposit', {
    method: 'POST',
    body: JSON.stringify({ user, amount: ethers.formatEther(amount), txHash })
  });
};

// Hủy lắng nghe khi cần
export const STOP_LISTENING = () => {
  if (eventListener) {
    contractRead.off('BoxOpened', eventListener);
    console.log('🛑 Đã dừng lắng nghe sự kiện');
  }
};