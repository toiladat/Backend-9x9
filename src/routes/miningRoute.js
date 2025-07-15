import { Router } from 'express'
import { miningController } from '~/controllers/miningController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { playLimit } from '~/middlewares/playLimiterMiddlewares'
import { miningGoldValidation } from '~/validations/miningGoldValidation'
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
Route.route('/start')
  .get(playLimit, miningController.startMining )

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
Route.route('/submit')
  .post(playLimit, miningGoldValidation.minningGold, miningController.submitScore)

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

/**
 * @swagger
 * /mining/rest-times:
 *   get:
 *     summary: Lấy thông tin lượt chơi còn lại và thời gian hồi lượt tiếp theo
 *     tags:
 *       - MINING GOLD
 *     responses:
 *       200:
 *         description: Số lượt chơi hiện tại và thời gian hồi lượt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restTimes:
 *                   type: number
 *                   description: Số lượt chơi còn lại
 *                   example: 5
 *                 totalTimes:
 *                   type: number
 *                   description: Tổng lượt tối đa có thể đạt được
 *                   example: 9
 *                 timeRestore:
 *                   type: number
 *                   description: Thời gian còn lại (milliseconds) để hồi 1 lượt tiếp theo
 *                   example: 19000
 *                 lastUpdatedTime:
 *                   type: number
 *                   description: Timestamp lần cuối cập nhật lượt chơi
 *                   example: 1721055600000
 *       500:
 *         description: Lỗi server
 */
Route.route('/rest-times')
  .get(miningController.getRestTimes)

/**
 * @swagger
 * /mining/get-message/{number}:
 *   get:
 *     summary: Lấy thông điệp với lượt đào vàng tương ứng
 *     tags:
 *       - MINING GOLD
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: Số lượt chơi cần lấy thông điệp
 *     responses:
 *       200:
 *         description: Thông điệp tương ứng với số lượt chơi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   example: 'ha ha ha'
 *       500:
 *         description: Lỗi server
 */
Route.route('/get-message/:number')
  .get(miningGoldValidation.validNumber, miningController.getMessage)
export const miningRoute = Route
