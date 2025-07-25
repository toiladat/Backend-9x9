import { Router } from 'express'
import { boxController } from '~/controllers/boxController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { boxMiddewares } from '~/middlewares/boxMiddewares'
const Route = Router()

Route.use(authMiddlewares.auth, authMiddlewares.isKyc)

/**
 * @swagger
 * /box/approve:
 *   post:
 *     summary: Ủy quyền contract Box
 *     tags:
 *       - BOX
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txHash
 *               - boxNumber
 *             properties:
 *               txHash:
 *                 type: string
 *                 example: "0xc30a8e1ad70acd22c6350ba9d74e09f05574f672"
 *     responses:
 *       200:
 *         description: trả về mã hash chứa addresses, amounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 boxNumber:
 *                   type: number
 *                   example: 2
 *       400:
 *         description: Request không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Route.route('/approve')
  .post(boxMiddewares.validTransactionApprove, boxController.approve )

/**
 * @swagger
 * /box/open:
 *   post:
 *     summary: Mở box
 *     tags:
 *       - BOX
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txHash
 *             properties:
 *               txHash:
 *                 type: string
 *                 example: "0xc30a8e1ad70acd22c6350ba9d74e09f05574f672"
 *     responses:
 *       200:
 *         description: Mở box thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 boxNumber:
 *                   type: number
 *                   example: 2
 *       400:
 *         description: Request không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Route.route('/open')
  .post(boxMiddewares.validTransactionOpenBox, boxController.openBox)
export const boxRoute = Route
