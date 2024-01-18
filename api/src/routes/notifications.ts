import { Router } from 'express'
import { controller, validator, permissions } from '@/middlewares'
import { accessTokenAuth } from '@/middlewares/auth'
import { findAll, findOne } from '@/middlewares/db'
import UserNotification from '@/models/notification'
import Subscribent from '@/models/subscribent'
import User from '@/models/user'
import { NotificationForm } from '@/forms/notifications'
import { UrlForm } from '@/forms'
import { recordParam } from '@/utils/urlBuilder'

const router = Router()

router.get('/notifications',
    accessTokenAuth,
    permissions('notifications.read'),
    findAll(UserNotification),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.get(`/notifications/${recordParam}`,
    accessTokenAuth,
    permissions('notifications.read'), 
    validator(UrlForm),
    findOne(UserNotification),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.post('/notifications',
    accessTokenAuth,
    permissions('notifications.send'),
    validator(NotificationForm),
    controller(async (req, res) => {
        const { content, roles } = req.body
        const sender: any = req.user
        const notification = await UserNotification.create({ content, roles, sender })
        const recipients = await User.find({
            role: { $in: roles },
            _id: { $ne: sender._id }
        })
       
        const subscribents = recipients.map(subscribent => ({ subscribent, notification }))
        await Subscribent.insertMany(subscribents)

        res.status(201).send({
            data: req.data,
            message: req.t('createdSuccessfully'),
        })
    })
)

export default router
