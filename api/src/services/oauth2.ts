import qs from 'qs'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { Router } from 'express'

import config from '@/config'
import Role from '@/models/role'
import User from '@/models/user'
import { OAuth2Form } from '@/forms/auth'
import buildUrl from '@/utils/urlBuilder'
import { controller, validator } from '@/middlewares'
import { UnauthenticatedException, UninitializedAppException } from '@/exceptions'
import { sendEmail } from '@/services/mailer'


interface HttpQueryParams {
    [key: string]: string;
}
interface UserDetails {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
}
interface OAuth2Settings {
    provider: string;
    authorizationUrl: string;
    tokenUrl: string;
    redirectUri: string;
    clientId: string;
    clientSecret: string;
    scope: string[];
    getUserDetails: (accessToken: string) => Promise<UserDetails>;

    params?: HttpQueryParams;
}

export function generateOAuth2Router(settings: OAuth2Settings) {
    async function requestForToken(code: string) {
        const body = qs.stringify({
            client_id: settings.clientId,
            client_secret: settings.clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: settings.redirectUri,
        })
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded', }
        const response = await axios.post(settings.tokenUrl, body , { headers })
        return response.data
    }

    const router = Router()

    router.get(`/auth/${settings.provider}/authorization-url`,
        controller(async (_req, res) => {
            const state = jwt.sign({}, config.jwtSecret, { expiresIn: 60 })
            const url = buildUrl(settings.authorizationUrl, {
                response_type: 'code',
                client_id: settings.clientId,
                scope: settings.scope.join(' '),
                redirect_uri: settings.redirectUri,            
                state,
                ...settings.params
            })

            res.status(200).send({ url })
        })
    )

    router.post(`/auth/${settings.provider}/sessions`,
        validator(OAuth2Form),
        controller(async (req, res) => {
            const { code, state } = req.body
            
            const verify = (token: string, secret: jwt.Secret) => new Promise(
                resolve => jwt.verify(token, secret, err => resolve(!err))
            )
            if (!await verify(state, config.jwtSecret)) {
                throw new UnauthenticatedException(req)
            }

            const credentials = await requestForToken(code as string)
            const userDetails = await settings.getUserDetails(credentials['access_token'])
            const { name, email, id, avatarUrl } = userDetails

            let user: any = await User.findOne({ email })
            if (!user) {
                const role = await Role.findOne({ slug: config.roles.builtIn.unverified })
                if (!role) {
                    throw new UninitializedAppException(req)
                }

                user = await User.create({
                    name,
                    email,
                    role,
                    avatarUrl,
                    externalServiceId: { service: settings.provider, identifier: id },
                })

                sendEmail(req.lang, 'welcome', email, { name })
            }

            const accessToken = user.generateAccessToken()
            const refreshToken = await user.createRefreshToken()

            res.status(201).send({ accessToken, refreshToken })
        })
    )

    return router
}
