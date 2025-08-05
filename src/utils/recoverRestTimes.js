import { MAX_PLAY_TIMES, MINUTES_PER_RECOVERY } from './constants'

export const recoverRestTimes = (user) => {
  const now = Date.now()
  const lastUpdate = new Date(user.lastPlayedTime).getTime()
  const elapsed = now - lastUpdate

  const recovered = Math.floor(elapsed / MINUTES_PER_RECOVERY)
  const newRestTimes = Math.min(user.restTimes + recovered, MAX_PLAY_TIMES)
  const newLastUpdatedTime = new Date(lastUpdate + recovered * MINUTES_PER_RECOVERY)

  const timeRestore =
    newRestTimes >= MAX_PLAY_TIMES ? 0 : MINUTES_PER_RECOVERY - (elapsed % MINUTES_PER_RECOVERY)

  return {
    restTimes: newRestTimes,
    lastPlayedTime: newLastUpdatedTime,
    timeRestore,
    totalTimes: MAX_PLAY_TIMES
  }
}
