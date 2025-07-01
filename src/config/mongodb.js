/* eslint-disable no-console */
import { MongoClient } from 'mongodb'

let clientInstance = null
let databaseInstance = null

export const CONNECT_DB = async () => {
  try {
    // Tạo client kết nối
    clientInstance = new MongoClient(process.env.MONGO_URL, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    })

    // Kết nối tới server
    await clientInstance.connect()

    // Lấy database instance
    databaseInstance = clientInstance.db(process.env.DATABASE_NAME)
    console.log(`Kết nối thành công! Database: ${process.env.DATABASE_NAME}`)
    return databaseInstance
  } catch (error) {
    console.error('Lỗi kết nối:', error)
  }
}

export const GET_DB = () => {
  if (!databaseInstance) throw new Error('Phải kết nối database trước!')
  return databaseInstance
}

export const CLOSE_DB = async () => {
  if (clientInstance) {
    await clientInstance.close()
    clientInstance = null
    databaseInstance = null
  }
}