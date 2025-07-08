/* eslint-disable no-console */

import express from 'express'
import { CONNECT_DB } from '~/config/mongodb'
import dotenv from 'dotenv'
import { ClientRoute } from './routes'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { getSwaggerSpec } from './config/swagger'
import swaggerUi from 'swagger-ui-express'
import rateLimit from 'express-rate-limit'

dotenv.config()

const START_SERVER = () => {

  const app = express()
  const scoreLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 5, // chỉ 5 lần gọi API / phút
    statusCode:500,
    message: 'Too many requests'
  })
  // app.use(scoreLimiter)
  // app.use(cors(corsOptions))
  app.use(cors())


  app.use(express.json())

  const hostname = process.env.LOCAL_APP_HOST
  const port = process.env.LOCAL_APP_PORT

  app.use('/api', ClientRoute)
  app.use( errorHandlingMiddleware)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getSwaggerSpec()))

  if (process.env.BUILD_MODE === 'production' ) {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Production. I am running at host :${ port }/`)
    })
  } else {
    app.listen(port, hostname, () => {
      // eslint-disable-next-line no-console
      console.log(`I am running at: http://${ hostname }:${ port }/`)
    })
  }

}

( async () => {
  try {
    await CONNECT_DB()
    console.log('Connectd to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()
