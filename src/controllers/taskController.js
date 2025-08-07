import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import { taskService } from '~/services/taskService'
import { userService } from '~/services/userService'
import { REWARDS_MISSSIONS } from '~/utils/constants'

//[GET]/task/
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.updateAndGetTask(req.decoded.address)
    res.status(StatusCodes.OK).json(task)
  } catch (error) { next( error )}
}

//[PATCH] /task/update
const updateTask = async (req, res, next) => {
  try {
    const address = req.decoded.address
    const missions = req.body.missionCompleted
    const taskOfUser =await taskService.getTask(address)
    let totalReward = 0

    for (const misssion of Object.keys(missions)) {
      const newValue = missions[misssion]
      const oldValue = taskOfUser[misssion]
      if (!oldValue && newValue) {
        totalReward += REWARDS_MISSSIONS[misssion]
      }
    }

    // Cộng tiền nếu có
    if (totalReward > 0) {
      await userModel.grantReward({ address, score: totalReward })
    }
    //update task
    const updatedTask = await taskService.updateTask({
      address,
      ...missions
    })
    res.status(StatusCodes.OK).json(updatedTask)
  } catch (error) { next(error)}
}

export const taskController = {
  getTask,
  updateTask
}

