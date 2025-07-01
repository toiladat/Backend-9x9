import { Router } from 'express'
import { authController } from '~/controllers/authController'
import { addressValidation } from '~/validations/addressValidation'
import { userValidation } from '~/validations/userValidation'

const Route = Router()

Route.route('/nonce/:address')
  .get(addressValidation.isAddressValid, authController.getNonce)
Route.route('/login')
  .post( userValidation.login, authController.login)

export const authRoute = Route