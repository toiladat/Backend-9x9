import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'
import { miningGoldCache } from '~/utils/cache'

// [POST] /mining/start
const startMining = async (req, res, next) => {
  try {
    const address = req.decoded.address

    const sessionId = uuidv4()
    miningGoldCache.set(sessionId, {
      address,
      startAt: Date.now(),
      totalPlayTime:0,
      status:'playing'
    })
    res.status(StatusCodes.OK).json({ sessionId })

  } catch (error) { next(error) }
}

// [POST] /mining/pause
const pauseMining = async (req, res, next) => {
  try {
    const { sessionId } = req.body
    const session = miningGoldCache.get(sessionId)
    if (!session) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid session')
    if (session.status !=='playing') throw new ApiError(StatusCodes.BAD_REQUEST, 'Session not in playing state')
    session.totalPlayTime += (Date.now() - session.startAt) / 1000
    session.status ='paused'
    session.pauseAt= Date.now()

    miningGoldCache.set(sessionId, session)
    res.status(StatusCodes.OK).json({
      sessionId,
      totalPlayTime:session.totalPlayTime
    })
  } catch (error) { next(error)}
}

//[POST] /mining/continue
const continueMining = async (req, res, next) => {
  try {
    const { sessionId } = req.body
    const session = miningGoldCache.get(sessionId)
    if (!session) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid session')
    if (session.status !=='paused') throw new ApiError(StatusCodes.BAD_REQUEST, 'Session not in playing state')
    session.startAt = Date.now()
    session.status= 'playing'
    miningGoldCache.set(sessionId, session)
    res.status(StatusCodes.OK).json({
      sessionId,
      resumeAt: session.startAt
    })
  } catch (error) { next(error)}
}

// [POST] /mining/submit
const submitScore = async (req, res, next) => {
  try {
    const address = req.decoded.address
    const { sessionId, score } = req.body
    const session = miningGoldCache.get(sessionId)
    if (!session) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid session')
    if (session.address !== address) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid session owner' })

    const totalTime =session.totalPlayTime + (Date.now() - session.startAt) / 1000
    miningGoldCache.del(sessionId)

    if (totalTime < 5 || totalTime > 120)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'session duration is invalid')
    const updatedUser = await userService.updateScore({ address, score })
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error)}
}


export const miningController = {
  startMining,
  pauseMining,
  continueMining,
  submitScore
}
