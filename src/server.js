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
import { CONNECT_CONTRACT } from './config/contract'
import cookieParser from 'cookie-parser'

dotenv.config()
console.log(process.env.CONTRACT_ADDRESS);
console.log(process.env.RPC_ALCHEMY_URL);
console.log(process.env.CONTRACT_MUSDT_ADDRESS);
console.log(process.env.SYSTEM_ADDRESS);
const START_SERVER = () => {

  const app = express()
  // app.use(cors(corsOptions))
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://backend-9x9.onrender.com',
      'https://gasy-9x9-plus-fe.vercel.app',
      'https://gasy-9x9-plus-fe-git-main-phantansy2005devs-projects.vercel.app/'
    ],
    credentials: true
  }))
  app.use(express.json())

  const hostname = process.env.LOCAL_APP_HOST
  const port = process.env.LOCAL_APP_PORT
  app.use(cookieParser())
  app.use('/api', ClientRoute)
  app.use( errorHandlingMiddleware)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getSwaggerSpec()))

  if (process.env.BUILD_MODE === 'production' ) {
    app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
      console.log(`Production. I am running at: http://0.0.0.0:${process.env.PORT || 3000}/`)
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
    await CONNECT_CONTRACT()
    console.log('Connectd to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()