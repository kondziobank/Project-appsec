import acceptLanguageParser from 'accept-language-parser'
import { Request, Response, NextFunction } from 'express'
import config from '@/config'
import { getSupportedLanguages, translate } from '@/services/i18n'

export type Translator = (label: string) => string

declare global {
    namespace Express {
        interface Request {
            t: Translator
            lang: string
        }
    }
}

function chooseLanguage(header?: string): string {
    if (!header) {
        return config.i18n.defaultLanguage
    }

    const supportedLanguages = getSupportedLanguages()
    const language = acceptLanguageParser.pick(supportedLanguages, header)
    return language ?? config.i18n.defaultLanguage
}

export default function i18n(req: Request, _res: Response, next: NextFunction) {
    const language = chooseLanguage(req.headers['accept-language'])
    req.t = label => translate(language, label)
    req.lang = language
    next()
}
