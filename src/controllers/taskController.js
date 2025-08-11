import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import { taskService } from '~/services/taskService'
import { REWARDS_MISSSIONS } from '~/utils/constants'

//[GET]/task/
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.updateAndGetTask(req.decoded.address)
    res.status(StatusCodes.OK).json(task)
  } catch (error) { next( error )}
}

//[GET] /task/update
const updateTask = async (req, res, next) => {
  try {
    const address = req.decoded.address
    const missions = req.missionCompleted
    const taskOfUser = await taskService.getTask(address)
    let totalReward = 0

    // Object lưu các mission hợp lệ để update
    const filteredMissions = {}

    for (const mission of Object.keys(missions)) {
      const newValue = missions[mission]
      const oldValue = taskOfUser[mission]

      // Nếu nhiệm vụ đã true thì không cho set lại false
      if (oldValue && newValue === false) {
        filteredMissions[mission] = true // giữ nguyên true
        continue
      }
      // Nếu từ false sang true => thưởng
      if (!oldValue && newValue) {
        totalReward += REWARDS_MISSSIONS[mission]
      }

      filteredMissions[mission] = newValue
    }

    if (totalReward > 0) {
      await userModel.grantReward({ address, score: totalReward })
    }

    // update task chỉ với filteredMissions
    const updatedTask = await taskService.updateTask({
      address,
      ...filteredMissions
    })

    res.status(StatusCodes.OK).json(updatedTask)
  } catch (error) {
    next(error)
  }
}


export const taskController = {
  getTask,
  updateTask
}

