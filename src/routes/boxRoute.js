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
 *               boxNumber:
 *                 type: number
 *                 example: 3
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
 *                 success:
 *                   type: boolean
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

/**
 * @swagger
 * /box/{boxNumber}:
 *   get:
 *     summary: Lấy chi tiết box
 *     tags:
 *       - BOX
 *     parameters:
 *       - in: path
 *         name: boxNumber
 *         required: true
 *         schema:
 *           type: number
 *         example: 3
 *     responses:
 *       200:
 *         description: Trả về chi tiết box
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invitedCount:
 *                   type: number
 *                   example: 5
 *                 boxNumber:
 *                   type: number
 *                   example: 3
 *                 invitedBy:
 *                   type: string
 *                   example: "0xabc123..."
 *                 directedAmount:
 *                   type: number
 *                   example: 100
 *                 distributedAmount:
 *                   type: number
 *                   example: 50
 *                 referralChainAmount:
 *                   type: number
 *                   example: 30
 *                 receivedTotal:
 *                   type: number
 *                   example: 180
 *       400:
 *         description: Số box không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Box number is not valid"
 *       500:
 *         description: Lỗi server
 */
Route.route('/:boxNumber')
  .get(boxController.getDetail)
export const boxRoute = Route
