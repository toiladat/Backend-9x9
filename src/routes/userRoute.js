import { Router } from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { pagination } from '~/utils/pagination'
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
  .get(authMiddlewares.isKyc, pagination, userController.getUsers)

/**
 * @swagger
 * /user/get-me:
 *   get:
 *     summary: Lấy thông tin user
 *     tags:
 *       - USER
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6881b26c179b056a3c07d7ba"
 *                 address:
 *                   type: string
 *                   example: "0xd01498c3178d75ee69271ea62ad13e8c523e8038"
 *                 invitedBy:
 *                   type: string
 *                   example: "0xc30a8e1ad70acd22c6350ba9d74e09f05574f672"
 *                 inviterChain:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
 *                     - "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
 *                 isKyc:
 *                   type: boolean
 *                   example: true
 *                 score:
 *                   type: number
 *                   example: 0
 *                 restTimes:
 *                   type: number
 *                   example: 9
 *                 lastPlayedTime:
 *                   type: number
 *                   format: timestamp
 *                   nullable: true
 *                   example: null
 *                 amount:
 *                   type: number
 *                   example: 0
 *                 openBoxHistories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       boxNumber:
 *                         type: number
 *                         example: 1
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2025-07-24T04:31:11.407Z"
 *                       open:
 *                         type: boolean
 *                         example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-24T04:10:53.669Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 _destroy:
 *                   type: boolean
 *                   example: false
 *                 openedBox:
 *                   type: number
 *                   description: Số box đã mở
 *                   example: 0
 *       500:
 *         description: Lỗi server
 */
Route.route('/get-me')
  .get(authMiddlewares.isKyc, userController.getMe)
export const userRoute = Route
