import { Router } from 'express'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { taskController } from '~/controllers/taskController'
import { userValidation } from '~/validations/userValidation'

const Route = Router()

Route.use(authMiddlewares.auth, authMiddlewares.isKyc)

/**
 * @swagger
 * /task/:
 *   get:
 *     summary: Lấy danh sách nhiệm vụ
 *     tags:
 *       - TASK
 *     responses:
 *       200:
 *         description: Trả về danh sách nhiệm vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     miningTimes:
 *                       type: number
 *                       example: 9
 *                       description: Số lần chơi game hôm nay
 *                     continuousLoginDay:
 *                       type: number
 *                       example: 9
 *                       description: Số ngày đăng nhập liên tiếp
 *                     shareLink:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái chia sẻ link
 *                     joinGroup:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái tham gia cộng đồng
 *                     readTerms:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái đọc điều khoản
 *                     claimByDay:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [3, 11, 30]
 *                       description: Danh sách các mốc ngày đăng nhập liên tục mà người dùng đã nhận thưởng.
 *       500:
 *         description: Lỗi server
 */
Route.route('/')
  .get(taskController.getTask)

/**
 * @swagger
 * /task/update:
 *   patch:
 *     summary: Cập nhật trạng thái nhiệm vụ
 *     tags:
 *       - TASK
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               missionCompleted:
 *                 type: object
 *                 description: Trạng thái các nhiệm vụ người dùng đã hoàn thành
 *                 properties:
 *                   shareLink:
 *                     type: boolean
 *                     example: true
 *                   joinGroup:
 *                     type: boolean
 *                     example: true
 *                   readTerms:
 *                     type: boolean
 *                     example: false
 *     responses:
 *       200:
 *         description: Trạng thái nhiệm vụ sau khi cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6892deb894b2214ed13a6be6"
 *                 address:
 *                   type: string
 *                   example: "0xc30a8e1ad70acd22c6350ba9d74e09f05574f672"
 *                 miningTimes:
 *                   type: integer
 *                   example: 0
 *                 latestLoginDay:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-07T06:55:56.669Z"
 *                 continuousLoginDay:
 *                   type: integer
 *                   example: 3
 *                 shareLink:
 *                   type: boolean
 *                   example: true
 *                 joinGroup:
 *                   type: boolean
 *                   example: true
 *                 readTerms:
 *                   type: boolean
 *                   example: false
 *                 claimByDay:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [3]
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Action again"
 *       500:
 *         description: Lỗi server nội bộ
 */
Route.route('/update')
  .patch(userValidation.validMissionCompleted, taskController.updateTask)

export const taskRoute = Route
