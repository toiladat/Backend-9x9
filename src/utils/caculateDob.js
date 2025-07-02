export const calculateLifePathNumber = (dob) => {
  const [day, month, year] = dob.split('/').map(Number)
  const reduce = (num) => {
    while (num > 9 && ![11, 22].includes(num)) num = num.toString().split('').reduce((a, b) => a + +b, 0)
    return num
  }
  return reduce(day + month + year)
}
