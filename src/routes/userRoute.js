import { Router } from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { paginationMiddleware } from '~/utils/pagination'
import { userValidation } from '~/validations/userValidation'

const Route = Router()
Route.use(authMiddlewares.auth)

/**
 * @swagger
 * /user/kyc:
 *   patch:
 *     summary: KYC qua Email
 *     tags:
 *       - USER
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "tdat9663@gmail.com"
 *     responses:
 *       200:
 *         description: Lưu tạm Email và CCCD và gửi mail thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent, please check your mailbox"
 *       400:
 *         description: Email đã tồn tại hoặc lỗi trong quá trình gửi mail
 *         content:
  *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Action again"
 *       500:
 *         description: Lỗi server
 */
Route.route('/kyc')
  .patch(userValidation.requestkyc, userController.requestKyc)

/**
 * @swagger
 * /user/verify-kyc:
 *   patch:
 *     summary: Sau khi gữi mã qua email, người dùng gửi mã qua BE để verify
 *     tags:
 *       - USER
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kycOtp
 *             properties:
 *               kycOtp:
 *                 type: string
 *                 example: "930482"
 *     responses:
 *       200:
 *         description: KYC thành công, trả về accessToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1N"
 *       400:
 *         description: Lỗi do sai OTP..
 *         content:
  *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "KYC failed"
 *       500:
 *         description: Lỗi server
 */
Route.route('/verify-kyc')
  .patch(userValidation.verifyKyc, userController.verifyKyc)

/**
 * @swagger
 * /user/resend-otp:
 *   patch:
 *     summary: Cần gửi lại mã qua Email
 *     tags:
 *       - USER
*     responses:
 *       200:
 *         description: Lưu OTP mới và gửi mail thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent, please check your mailbox"
 *       400:
 *         description: Email đã tồn tại hoặc lỗi trong quá trình gửi mail
 *         content:
  *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Action again"
 *       500:
 *         description: Lỗi server
 */
Route.route('/resend-otp')
  .patch(userController.resendOtp)

/**
 * @swagger
 * /user/ranking:
 *   get:
 *     summary: Lấy thông tin bảng xếp hạng điểm hạt thịnh vượng
 *     tags:
 *       - USER
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Số lượng user mỗi trang
 *     responses:
 *       200:
 *         description: Thông tin người dùng và phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: "0xabc123..."
 *                       score:
 *                         type: integer
 *                         example: 89
 *                       name:
 *                         type: string
 *                         example: "Nguyen Van A"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     limit:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageTotal:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Lỗi server
 */
Route.route('/ranking')
  .get(authMiddlewares.isKyc, paginationMiddleware, userController.getUsers)
export const userRoute = Route
