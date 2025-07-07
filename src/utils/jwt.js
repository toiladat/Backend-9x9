import jwt from 'jsonwebtoken'

const generateToken = async (user, secretSignature, tokenLife) => {

  try {
    const token = await jwt.sign(
      user,
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife
      }
    )
    return token
  } catch (error) {
    throw error
  }
}

const verifyToken = async (token, secretKey) => {
  try {
    const decoded = await jwt.verify(token, secretKey)
    return decoded
  } catch (error) {
    throw error
  }
}

export const jwtUtils = {
  generateToken,
  verifyToken
}