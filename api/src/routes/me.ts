import { Router } from 'express'
import { controller, validator } from '@/middlewares'
import { accessTokenAuth } from '@/middlewares/auth'
import { UnauthenticatedException, PublicException, ResourceNotFoundException } from '@/exceptions'
import { jwtEmailConfirmationToken, jwtResetPasswordToken } from '@/services/jwt'
import { sendEmail } from '@/services/mailer'
import { TokenForm, EmailForm, UrlForm } from '@/forms'
import { PasswordResetForm, ReadNotificationForm } from '@/forms/me'
import User from '@/models/user'
import config from '@/config'
import Subscribent from '@/models/subscribent'
import { SelfUserUpdateForm } from '@/forms/users'

const router = Router()

router.get('/me',
    accessTokenAuth,
    controller(async (req, res) => {
        res.status(200).send({ data: req.user })
    })
)

router.put('/me',
    accessTokenAuth,
    validator(SelfUserUpdateForm),
    controller(async (req, res) => {
        const user: any = req.user;
        user.name = req.body.name;
        user.avatarUrl = req.body.avatarUrl;
        await user.save();

        res.status(200).send({ data: req.user })
    })
)


router.post('/me/confirmation-tokens',
    accessTokenAuth,
    controller(async (req, res) => {
        const { id, name, email, emailConfirmed } = req.user as any
        if (emailConfirmed) {
            throw new PublicException(req.t('accountAlreadyConfirmed'), 409)
        }

        const token = jwtEmailConfirmationToken.sign({ id })
        sendEmail(req.lang, 'welcome_confirm', email, {
            name,
            confirmationUrl: config.emailConfirmationUrl(token),
        })
        res.status(201).send({})
    })
)

router.delete('/me/confirmation-tokens/:token',
    validator(TokenForm),
    controller(async (req, res) => {
        const { token } = req.params      
        
        const payload = jwtEmailConfirmationToken.verify(token)
        if (!payload) {
            throw new UnauthenticatedException(req)
        }
        
        const user: any = await User.findById(payload.id)
        if (!user) {
            throw new UnauthenticatedException(req)
        } else if (user.emailConfirmed) {
            throw new PublicException(req.t('accountAlreadyConfirmed'), 409)
        }

        user.emailConfirmed = true
        await user.save()

        res.status(200).send({})
    })
)

router.post('/me/reset-password-tokens',
    validator(EmailForm),
    controller(async (req, res) => {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            throw new ResourceNotFoundException(req)
        }

        const token = jwtResetPasswordToken.sign({ email })
        sendEmail(req.lang, 'reset_password', email, {
            resetPasswordUrl: config.resetPasswordUrl(token),
        })
        res.status(201).send({})
    })
)

router.delete('/me/reset-password-tokens/:token',
    validator(TokenForm),
    validator(PasswordResetForm),
    controller(async (req, res) => {
        const { token } = req.params
        const { password } = req.body

        const payload = jwtResetPasswordToken.verify(token)
        if (!payload) {
            throw new UnauthenticatedException(req)
        }

        const { email } = payload
        const user: any = await User.findOne({ email })
        if (!user) {
            throw new UnauthenticatedException(req)
        }

        await user.setPassword(password)
        await user.save()

        res.status(201).send({})
    })
)

function booleanQueryParamValue(param: any|undefined) {
    if (param === '1') {
        return true;
    } else if (param === '0') {
        return false;
    } else {
        return undefined;
    }
}

function removeKeysWithUndefinedValues(obj: object): object {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, value]) => value !== undefined)
    );
}

router.get('/me/notifications',
    accessTokenAuth,
    controller(async (req, res) => {
        const read = booleanQueryParamValue(req.query.read)
        const searchParams = removeKeysWithUndefinedValues({ subscribent: req.user, read })
        const notifications = await Subscribent.find(searchParams)
            .select('-_id read')
            .populate({
                path: 'notification',
                select: '_id content createdAt updatedAt',
                populate: {
                    path: 'sender',
                    model: 'User',
                    select: '_id name slug avatarUrl',
                },
                options: {
                    sort: { createdAt: 'desc' }
                }
            })
            .sort({ notification: 'desc' })

        res.status(200).send({ data: notifications })
    })
)

router.put(`/me/notifications/read`,
    accessTokenAuth,
    validator(ReadNotificationForm),
    controller(async (req, res) => {
        await Subscribent.updateMany(
            { subscribent: req.user, read: !req.body.read },
            { $set: { read: req.body.read } }
        );

        res.status(200).send({ message: req.t('updatedSuccessfully') })
    })
)

router.put(`/me/notifications/~:id/read`,
    accessTokenAuth,
    validator(ReadNotificationForm),
    controller(async (req, res) => {
        await Subscribent.updateOne(
            { notification: req.params.id, subscribent: req.user },
            { $set: { read: req.body.read } }
        );

        res.status(200).send({ message: req.t('updatedSuccessfully') })
    })
)

export default router
