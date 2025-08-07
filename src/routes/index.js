import { Router } from 'express'
import { userRoute } from './userRoute'
import { authRoute } from './authRoute'
import { numerologyRoute } from './numerologyRoute'
import { miningRoute } from './miningRoute'
import { boxRoute } from './boxRoute'
import { taskRoute } from './taskRoute'

const Route = Router()

Route.use('/user', userRoute)
Route.use('/auth', authRoute)
Route.use('/numerology', numerologyRoute)
Route.use('/mining', miningRoute)
Route.use('/box', boxRoute)
Route.use('/task', taskRoute)
export const ClientRoute = Route