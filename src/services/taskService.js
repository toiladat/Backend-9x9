import { miningHistoriesModel } from '~/models/miningHistoriesModel'
import { taskModel } from '~/models/taskModel'
import { userModel } from '~/models/userModel'
import { REWARD_DAYS, REWARDS_MINING, VALID_PLAY_TIMES } from '~/utils/constants'

const updateAndGetTask = async (address) => {
  try {
    let rewards = 0
    // số lần đã chơi ngày hôm nay
    const miningTimesToDay = await miningHistoriesModel.getMiningCount({ address, time: Date.now() })
    if (miningTimesToDay === VALID_PLAY_TIMES ) rewards += REWARDS_MINING

    // số ngày đăng nhập liên tục
    const task = await taskModel.getTask(address)
    const claimed = task.claimByDay || []
    const day = task.continuousLoginDay

    for (const milestone of REWARD_DAYS) {
      if (day == milestone.day && !claimed.includes(milestone.day)) {
        rewards+=milestone.score
        claimed.push(milestone.day)
      }
    }

    // thêm điểm khi đăng nhập đúng mốc || chơi đủ 9 / ngày
    if (rewards > 0) {
      await userModel.grantReward({ address, score: rewards })
    }

    // Cập nhật lại task
    const result = await taskModel.updateTask({
      address,
      miningTimes: miningTimesToDay,
      claimByDay: claimed
    })
    return await taskModel.getTask(result.address)
  } catch (error) { throw error}
}

const getTask = async (address) => {
  try {
    return await taskModel.getTask(address)
  } catch (error) { throw error}
}

const updateTask = async(data) => {
  try {
    return await taskModel.updateTask(data)
  } catch (error) { throw error}
}

export const taskService = {
  getTask,
  updateTask,
  updateAndGetTask
}
