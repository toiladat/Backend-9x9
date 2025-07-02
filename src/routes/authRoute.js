import { Router } from 'express'
import { authController } from '~/controllers/authController'
import { addressValidation } from '~/validations/addressValidation'
import { userValidation } from '~/validations/userValidation'

const Route = Router()

/**
 * @swagger
 * /auth/nonce/{address}:
 *   get:
 *     summary: Lấy nonce để xác thực địa chỉ ví
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           example: "0xc30a8e1ad70acd22c6350ba9d74e09f05574f672"
 *         description: Địa chỉ ví (Safebal, v.v.)
 *     responses:
 *       200:
 *         description: Thành công, trả về nonce
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nonce:
 *                   type: string
 *                   example: "928371"
 *       400:
 *         description: Địa chỉ không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address is not valid"
 *       500:
 *         description: Lỗi server
 */
Route.route('/nonce/:address')
  .get(addressValidation.isAddressValid, authController.getNonce)


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập người dùng bằng chữ ký ví
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - signature
 *               - message
 *             properties:
 *               address:
 *                 type: string
 *                 example: "0xc30a8e1ad70acd22c6350ba9d74e09f05574f672"
 *               signature:
 *                 type: string
 *                 example: "0xe06e7f3f2efb80b8ac47e03f1a9284058974acb92e63d5c1a4b5113ebda6bd607855de31088dd7e8010ed5092af31693afb3f3be405d71f070a3bbad5884cada1c"
 *               message:
 *                 type: string
 *                 example: "72268d709ece62067ed1cf95a53ad5be"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Request không hợp lệ
 *       401:
 *         description: Sai chữ ký hoặc nonce
 *       500:
 *         description: Lỗi server
 */
Route.route('/login')
  .post( userValidation.login, authController.login)

export const authRoute = Route