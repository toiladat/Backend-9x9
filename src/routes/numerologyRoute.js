import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { userValidation } from '~/validations/userValidation'
import { Router } from 'express'
import { numerologyController } from '~/controllers/numerologyController'


const Route = Router()
Route.use(authMiddlewares.auth)

/**
 * @swagger
 * /numerology/meanings:
 *   post:
 *     summary: Chơi thần số học
 *     tags:
 *       - NUMEROLOGY
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birth
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               birth:
 *                 type: string
 *                 example: "02/09/2012"
 *     responses:
 *       200:
 *         description: Trả về số và ý nghĩa con số
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Nguyen Van A"
 *                 number:
 *                   type: string
 *                   example: "7"
 *                 meaning:
 *                   type: object
 *                   properties:
 *                     mission:
 *                       type: string
 *                       example: "Lãnh đạo, độc lập"
 *                     personality:
 *                       type: string
 *                       example: "Quyết đoán, sáng tạo"
 *                     destiny:
 *                       type: string
 *                       example: "Thành công trong sự nghiệp"
 *                     lifePath:
 *                       type: string
 *                       example: "Khám phá bản thân"
 *                     soul:
 *                       type: string
 *                       example: "Đồng cảm và yêu thương"
 *                     body:
 *                       type: string
 *                       example: "Khỏe mạnh và năng động"
 *       500:
 *         description: Lỗi server
 */
Route.route('/meanings')
  .post(authMiddlewares.isKyc, userValidation.numerology, numerologyController.numerology)

export const numerologyRoute = Route