import nodemailer from 'nodemailer'
import Email from 'email-templates'
import path from 'path'
import config from '@/config'

let transporter: nodemailer.Transporter;

export async function init() {
    transporter = nodemailer.createTransport({
        host: config.mailer.smtp.host,
        port: config.mailer.smtp.port,
        secure: config.mailer.smtp.secure,
        auth: config.mailer.auth,
    })
}

class TransportEmail extends Email {
    constructor(settings?: Email.EmailConfig<any>) {
        settings = settings ?? {}
        const root = path.join(__dirname, '../../assets/emails')
        super({
            ...settings,
            transport: transporter,
            preview: false,
            views: { root },
            message: {
                from: config.mailer.auth.user,
            },
            send: true
        })
    }
}


interface ILocals {
    [key: string]: any
}

export function sendEmail(lang: string, template: string, to: string, locals: ILocals) {
    const e = new TransportEmail()
    e.send({
        template: path.join(lang, template),
        message: { to },
        locals: {
            appName: config.appName,
            ...locals
        }
    })
}

export default TransportEmail
