import { Router } from 'express'
import { controller, permissions, validator } from '@/middlewares'
import { accessTokenAuth } from '@/middlewares/auth'
import { ResourceNotFoundException } from '@/exceptions'
import { UninitializedAppException } from '@/exceptions'
import { sendEmail } from '@/services/mailer'
import { jwtEmailConfirmationToken } from '@/services/jwt'
import { RegistrationForm, UserUpdateForm } from '@/forms/users'
import { EmailForm, UrlForm } from '@/forms'
import { findOne, findAll, updateOne, deleteOne } from '@/middlewares/db'
import { recordParam } from '@/utils/urlBuilder'
import User from '@/models/user'
import Role from '@/models/role'
import config from '@/config'

const router = Router()

router.get('/users',
    accessTokenAuth,
    permissions('users.read'),
    findAll(User, query => query.populate('role')),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.post('/users/registrations',
    validator(RegistrationForm),
    controller(async (req, res) => {
        const role = await Role.findOne({ slug: config.roles.builtIn.unverified })
        if (!role) {
            throw new UninitializedAppException(req)
        }

        const { name, slug, email, password } = req.body
        const user = new User({ name, slug, email, role })
        const { id } = await User.register(user, password)

        const token = jwtEmailConfirmationToken.sign({ id })
        sendEmail(req.lang, 'welcome_confirm', email, {
            name,
            confirmationUrl: config.emailConfirmationUrl(token),
        })

        res.status(201).send({
            message: 'User successfully registered'
        })
    })
)

router.get(`/users/${recordParam}`,
    accessTokenAuth,
    permissions('users.read'),
    validator(UrlForm),
    findOne(User, query => query.populate('role')),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.put(`/users/${recordParam}`,
    accessTokenAuth,
    permissions('users.write'),
    validator(UrlForm),
    validator(UserUpdateForm),
    updateOne(User, ['role', 'slug', 'name']),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.delete(`/users/${recordParam}`,
    accessTokenAuth,
    permissions('users.write'),
    validator(UrlForm),
    deleteOne(User),
    controller(async (req, res) => {
        res.status(200).send({})
    })
)

router.head('/users/emails/:email',
    validator(EmailForm),
    controller(async (req, res) => {
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            throw new ResourceNotFoundException(req)
        }

        res.status(200).send()
    })
)

export default router
