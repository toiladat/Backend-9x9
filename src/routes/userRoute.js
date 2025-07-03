import { Router } from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
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
 *         description: KYC thành công, trả về message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "KYC successfully"
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

Route.route('/numerology')
  .patch(authMiddlewares.isKyc, userValidation.numerology, userController.numerology)
export const userRoute = Route