import rateLimit from 'express-rate-limit'

export const playLimit = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5, // chỉ 5 lần gọi API / phút
  statusCode:500,
  message: 'Too many requests'
})