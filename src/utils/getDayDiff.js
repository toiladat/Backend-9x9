export const getDayDiff = (startDate, endDate) => {
  startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  return Math.floor( (endDate - startDate) / ( 1000 * 60 * 60 * 24))
}