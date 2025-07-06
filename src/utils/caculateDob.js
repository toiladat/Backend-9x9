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

  return reduce(total)
}
