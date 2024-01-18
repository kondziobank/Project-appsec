import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import routes from '@/routes'
import initRoute from '@/routes/init'
import { notFoundRoute, catchExceptions } from '@/middlewares/error'
import { assertAppInitialized } from '@/middlewares/init'
import swagger from '@/services/swagger'
import i18n from '@/middlewares/i18n'

export default async () => {
    const app = express()

    app.use(cors())
    app.use(i18n)
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    
    app.use(swagger)

    app.use(initRoute)
    app.use(assertAppInitialized)
    app.use(await routes())
    app.use(notFoundRoute)

    app.use(catchExceptions)

    return app
}
