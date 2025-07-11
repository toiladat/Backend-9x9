import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import { miningService } from '~/services/miningService'
import ApiError from '~/utils/ApiError'
import { miningGoldCache } from '~/utils/cache'
import { PLAY_MAX_TIME, PLAY_MIN_TIME } from '~/utils/constants'

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
    if (!session) throw new ApiError(StatusCodes.NOT_FOUND, 'Phiên chơi không tồn tại hoặc đã kết thúc')
    if (session.status !=='playing') throw new ApiError(StatusCodes.BAD_REQUEST, 'Trạng thái phiên không hợp lệ')
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
    if (!session) throw new ApiError(StatusCodes.NOT_FOUND, 'Phiên chơi không tồn tại hoặc đã kết thúc')
    if (session.status !=='paused') throw new ApiError(StatusCodes.BAD_REQUEST, 'Trạng thái phiên không hợp lệ')
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
    if (!session) throw new ApiError(StatusCodes.NOT_FOUND, 'Phiên chơi không tồn tại hoặc đã kết thúc')
    if (session.address !== address) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Bạn không phải chủ sở hữu của phiên này' })

    const totalTime =session.totalPlayTime + (Date.now() - session.startAt) / 1000

    if (totalTime < PLAY_MIN_TIME || totalTime > PLAY_MAX_TIME)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thời gian chơi không hợp lệ')
    const result = await miningService.create({ address, score })
    miningGoldCache.del(sessionId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error)}
}


export const miningController = {
  startMining,
  pauseMining,
  continueMining,
  submitScore
}
