import { Router } from 'express'
import { controller, validator } from '@/middlewares'
import { accessTokenAuth, loginAuth, refreshTokenAuth } from '@/middlewares/auth'
import { LoginForm } from '@/forms/auth'

const router = Router()

router.get('/auth/sessions',
    accessTokenAuth,
    controller(async (_req, res) => {
        res.status(200).send({})
    })
)

router.post('/auth/sessions',
    validator(LoginForm),
    loginAuth,
    controller(async (req, res) => {
        const user: any = req.user
        const accessToken = user.generateAccessToken()
        const refreshToken = await user.createRefreshToken()
        res.status(201).send({ accessToken, refreshToken })
    })
)

router.put('/auth/sessions',
    refreshTokenAuth,
    controller(async (req, res) => {
        const user: any = req.user
        const accessToken = user.generateAccessToken()
        const refreshToken = await user.createRefreshToken()
        res.status(200).send({ accessToken, refreshToken })
    })
)

router.delete('/auth/sessions',
    // Refresh token authentication invalidates the passed refresh token
    // So it's like the logout mechanism work
    refreshTokenAuth,
    controller(async (_req, res) => {
        res.status(200).send({})
    })
)

export default router
