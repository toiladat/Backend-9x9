import { Router } from 'express'
import { miningController } from '~/controllers/miningController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { playLimit } from '~/middlewares/playLimiterMiddlewares'
import { userValidation } from '~/validations/userValidation'
const Route = Router()
Route.use(authMiddlewares.auth, authMiddlewares.isKyc)

/**
 * @swagger
 * /mining/start:
 *   get:
 *     summary: Bắt đầu chơi đào vàng
 *     tags:
 *       - MINING GOLD
 *     responses:
 *       200:
 *         description: Tạo phiên chơi mới và trả về sessionId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "cba123-uuid"
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Route.route(playLimit, '/start')
  .get( miningController.startMining )


/**
 * @swagger
 * /mining/submit:
 *   post:
 *     summary: Nộp điểm sau khi chơi đào vàng
 *     tags:
 *       - MINING GOLD
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - score
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "abc-xyz-uuid"
 *               score:
 *                 type: number
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Trả về thông tin user và điểm tổng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       example: "0x123...abc"
 *                     email:
 *                       type: string
 *                       example: "nva@gmail.com"
 *                     score:
 *                       type: number
 *                       example: 1234
 *       400:
 *         description: Dữ liệu không hợp lệ (session quá ngắn, sai địa chỉ...)
 *       404:
 *         description: Session không tồn tại hoặc không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Route.route(playLimit, '/submit')
  .post(userValidation.minningGold, miningController.submitScore)


/**
 * @swagger
 * /mining/pause:
 *   patch:
 *     summary: Tạm dừng phiên chơi đào vàng
 *     tags:
 *       - MINING GOLD
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "a12b3c-uuid"
 *     responses:
 *       200:
 *         description: Phiên chơi đã được tạm dừng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "a12b3c-uuid"
 *                 totalPlayTime:
 *                   type: number
 *                   example: 42.3
 *       400:
 *         description: Trạng thái phiên chơi không hợp lệ
 *       404:
 *         description: Không tìm thấy phiên chơi
 *       500:
 *         description: Lỗi server
 */
Route.route('/pause')
  .patch(miningController.pauseMining)

/**
 * @swagger
 * /mining/continue:
 *   patch:
 *     summary: Tiếp tục phiên chơi đào vàng đã tạm dừng
 *     tags:
 *       - MINING GOLD
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "a12b3c-uuid"
 *     responses:
 *       200:
 *         description: Phiên chơi tiếp tục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "a12b3c-uuid"
 *                 resumeAt:
 *                   type: number
 *                   example: 1720517092312
 *       400:
 *         description: Trạng thái phiên chơi không hợp lệ
 *       404:
 *         description: Không tìm thấy phiên chơi
 *       500:
 *         description: Lỗi server
 */
Route.route('/continue')
  .patch(miningController.continueMining)
export const miningRoute = Route