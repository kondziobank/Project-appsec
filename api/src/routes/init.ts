import { Router } from 'express'

import User from '@/models/user'
import Role from '@/models/role'
import Article from '@/models/article'
import SystemConfig from '@/models/system-config'
import config from '@/config'
import { controller, validator } from '@/middlewares'
import { isAppInitialized, assertAppUninitialized } from '@/middlewares/init'
import { RegistrationForm } from '@/forms/users'

const router = Router()

router.get('/init',
    controller(async (_req, res) => {
        const initialized = await isAppInitialized()
        res.status(200).send({
            data: { initialized }
        })
    })
)

router.post('/init',
    assertAppUninitialized,
    validator(RegistrationForm),
    controller(async (req, res) => {
        const rootArticle = await Article.create({
            name: req.t('rootArticleName'),
            slug: req.t('rootArticleSlug'),
            content: '{}',
            public: true
        })
        SystemConfig.create({ key: 'rootArticleId', value: rootArticle.id });

        await Role.create({
            name: req.t('unverifiedRole'),
            slug: config.roles.builtIn.unverified,
            permissions: [],
            builtIn: true,
        })

        // TODO: split uploads.write role for uploading avatar and writing any upload
        await Role.create({
            name: req.t('readerRole'),
            slug: config.roles.builtIn.reader,
            permissions: ['articles.read', 'uploads.read', 'uploads.write'],
            builtIn: true,
        })

        await Role.create({
            name: req.t('writerRole'),
            slug: config.roles.builtIn.writer,
            permissions: ['articles.read', 'articles.readPrivate', 'articles.write', 'uploads.read', 'uploads.write'],
            builtIn: true,
        })

        const role = await Role.create({
            name: req.t('adminRole'),
            slug: config.roles.builtIn.admin,
            permissions: config.permissions,
            builtIn: true,
        })

        const { name, email, password } = req.body
        const user = new User({ name, email, role, emailConfirmed: true })
        await User.register(user, password)

        const { slug } = user as any
        res.status(201).send({
            data: { slug },
            message: req.t('initializedSuccessfully'),
        })
    })
)

export default router
