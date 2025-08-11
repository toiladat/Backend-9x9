export const calculateNumerology = (dob, fullName) => {
  const [day, month, year] = dob.split('/').map(Number)

  const reduce = (num) => {
    while (num > 9 && ![11, 22, 33].includes(num)) {
      num = num.toString().split('').reduce((a, b) => a + +b, 0)
    }
    return num
  }

  // ===== TÍNH TỪ DOB =====
  const soulDay = reduce(day) // ngày sinh
  const personalityMonth = reduce(month) // tháng sinh
  const bodyYear = reduce(year.toString().split('').reduce((a, b) => a + +b, 0)) // năm sinh

  const lifePath = reduce(soulDay + personalityMonth + bodyYear) // đường đời

  const allDigits = dob.replaceAll('/', '').split('').map(Number)
  const mainNumber = reduce(allDigits.reduce((a, b) => a + b, 0)) // số chính

  // ===== TÍNH TỪ TÊN =====
  const P = {
    A:1, J:1, S:1,
    B:2, K:2, T:2,
    C:3, L:3, U:3,
    D:4, M:4, V:4,
    E:5, N:5, W:5,
    F:6, O:6, X:6,
    G:7, P:7, Y:7,
    H:8, Q:8, Z:8,
    I:9, R:9
  }
  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])
  //DO THI HUYEN TRANG
  const normalizeName = (name) =>
    (name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toUpperCase()

  const getSumFromName = (name, filterFn) => {
    let sum = 0
    for (const ch of normalizeName(name)) {
      if (P[ch] && (!filterFn || filterFn(ch))) {
        sum += P[ch]
      }
    }
    return reduce(sum)
  }

  const destiny = getSumFromName(fullName) // sứ mệnh (tất cả chữ cái)
  const soul = getSumFromName(fullName, ch => VOWELS.has(ch)) // linh hồn (nguyên âm)
  const personality = getSumFromName(fullName, ch => !VOWELS.has(ch)) // tính cách (phụ âm)
  return {
    lifePath,
    destiny,
    soul,
    personality,
    body: bodyYear,
    mainNumber
  }
}
