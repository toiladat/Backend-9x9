export const calculateLifePathNumber = (dob) => {

  const [day, month, year] = dob.split('/').map(Number)

  const reduce = (num) => {
    while (num > 9 && ![11, 22, 33].includes(num)) {
      num = num.toString().split('').reduce((a, b) => a + +b, 0)
    }
    return num
  }

  const daySum = reduce(day)
  const monthSum = reduce(month)
  const yearSum = reduce(year.toString().split('').reduce((a, b) => a + +b, 0))

  const total = daySum + monthSum + yearSum

  // Từng phần rút gọn
  const soul = reduce(day)
  const personality = reduce(month)
  const body = reduce(year.toString().split('').reduce((a, b) => a + Number(b), 0))

  // Tổng để tính life path
  const totalRaw = soul + personality + body
  const lifePath = reduce(totalRaw)

  // Destiny: cộng tất cả số trong DOB (ddmmyyyy)
  const allDigits = dob.replaceAll('/', '').split('').map(Number)
  const destiny = reduce(allDigits.reduce((a, b) => a + b, 0))


  return {
    lifePath,
    destiny,
    soul,
    personality,
    body,
    mainNumber: reduce(total)
  }
}
