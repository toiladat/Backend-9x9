import { Router } from 'express'
import { userRoute } from './userRoute'
import { authRoute } from './authRoute'
import { numerologyRoute } from './numerologyRoute'

const Route = Router()

Route.use('/user', userRoute)
Route.use('/auth', authRoute)
Route.use('/numerology', numerologyRoute)

export const ClientRoute = Route