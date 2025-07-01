import { Router } from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { userValidation } from '~/validations/userValidation'

const Route = Router()
Route.use(authMiddlewares.auth)
Route.route('/')
  .get( (req, res ) => {
    res.json({
      message: 'ok'
    })
  })
Route.route('/kyc')
  .patch(authMiddlewares.auth, userValidation.requestkyc, userController.requestKyc)
Route.route('/verify-kyc')
  .patch(authMiddlewares.auth, userValidation.verifyKyc, userController.verifyKyc)
Route.route('/resend-otp')
  .patch(authMiddlewares.auth, userController.resendOtp)
export const userRoute = Route