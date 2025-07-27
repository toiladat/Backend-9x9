export const formatParsedLog = (parsedLog, decimals = 6) => {
  const addresses = parsedLog.args[2]
  const amounts = parsedLog.args[3]

  const rewards = addresses.map((addr, idx) => ({
    address: addr.toLowerCase(),
    amount: Number(amounts[idx]) / 10 ** decimals
  }))
  return {
    opener: parsedLog.args[0].toLowerCase(),
    boxNumber: Number(parsedLog.args[1]),
    rewards
  }
}
