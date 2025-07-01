/* eslint-disable no-console */

import express from 'express'
import { CONNECT_DB } from '~/config/mongodb'
import dotenv from 'dotenv'
import { ClientRoute } from './routes'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'
dotenv.config()

const START_SERVER = () => {

  const app = express()
  app.use(cors(corsOptions))

  app.use(express.json())

  const hostname = 'localhost'
  const port = process.env.port

  app.use('/api', ClientRoute)
  app.use( errorHandlingMiddleware)

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`I am running at: http://${ hostname }:${ port }/`)
  })

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
