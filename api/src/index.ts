import 'dotenv/config'
import database from '@/services/database'
import express from '@/services/express'
import passport from '@/services/passport'
import { init as initMailer } from '@/services/mailer'
import { init as initTranslations } from '@/services/i18n'

(async () => {
    await database()
    await initMailer()
    await initTranslations()
    const app = await express()
    passport()

    app.listen(process.env.PORT, () => console.log('Server running'))
})()
