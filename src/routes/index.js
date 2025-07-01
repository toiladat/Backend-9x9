import { Router } from 'express'
import { userRoute } from './userRoute'
import { authRoute } from './authRoute'

const Route = Router()

Route.use('/user', userRoute)
Route.use('/auth', authRoute)

export const ClientRoute = Route