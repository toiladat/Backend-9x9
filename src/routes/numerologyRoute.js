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
 *                   type: object
 *                   properties:
 *                     lifePath:
 *                       type: integer
 *                       example: 7
 *                     destiny:
 *                       type: integer
 *                       example: 7
 *                     soul:
 *                       type: integer
 *                       example: 2
 *                     personality:
 *                       type: integer
 *                       example: 9
 *                     body:
 *                       type: integer
 *                       example: 5
 *                     mainNumber:
 *                       type: integer
 *                       example: 7
 *                 meaning:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "NGƯỜI TÌM KIẾM CHÂN LÝ"
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "Thông điệp truyền tải"
 *                           value:
 *                             type: string
 *                             example: "Số 7 truyền tải thông điệp về sự khám phá, tìm kiếm sự thật và trí tuệ..."
 *       500:
 *         description: Lỗi server
 */
Route.route('/meanings')
  .post(authMiddlewares.isKyc, userValidation.numerology, numerologyController.numerology)

export const numerologyRoute = Route