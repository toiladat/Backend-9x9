import { Router } from 'express'
import { boxController } from '~/controllers/boxController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { boxMiddewares } from '~/middlewares/boxMiddewares'
import { pagination } from '~/utils/pagination'
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

/**
 * @swagger
 * /box/tree:
 *   post:
 *     summary: Lấy cây ref
 *     tags:
 *       - BOX
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - limit
 *               - page
 *             properties:
 *               address:
 *                 type: string
 *                 example: "0x584ef09005ffc6fd51558"
 *               limit:
 *                 type: number
 *                 example: 10
 *               page:
 *                 type: number
 *                 example: 1
 *     responses:
*       200:
 *         description: địa chỉ ví và phân trang
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
Route.route('/tree')
  .post( pagination, boxController.getTree)

export const boxRoute = Route

