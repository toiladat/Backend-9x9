import { MAX_PLAY_TIMES, MINUTES_PER_RECOVERY } from './constants'

export const recoverRestTimes = (user) => {
  const now = Date.now()
  const lastUpdate = new Date(user.lastUpdatedTime).getTime()
  const elapsed = now - lastUpdate
  const recovered = Math.floor(elapsed / MINUTES_PER_RECOVERY)

  return {
    restTimes: Math.min( user.restTimes + recovered, MAX_PLAY_TIMES ),
    lastUpdatedTime: new Date( lastUpdate + recovered * MINUTES_PER_RECOVERY )
  }
}
