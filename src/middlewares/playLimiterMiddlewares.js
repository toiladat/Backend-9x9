import rateLimit from 'express-rate-limit'

export const playLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  statusCode:500,
  message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
})