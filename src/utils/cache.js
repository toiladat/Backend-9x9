import NodeCache from 'node-cache'

// TTL: 300 giây = 5 phút
export const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

export const miningGoldCache = new NodeCache({ stdTTL: 100, checkperiod: 60 })
