import { Router } from 'express'
import { userRoute } from './userRoute'
import { authRoute } from './authRoute'
import { numerologyRoute } from './numerologyRoute'
import { miningRoute } from './miningRoute'

const Route = Router()

Route.use('/user', userRoute)
Route.use('/auth', authRoute)
Route.use('/numerology', numerologyRoute)
Route.use('/mining', miningRoute)

export const ClientRoute = Route