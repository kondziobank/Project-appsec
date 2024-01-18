import { Router } from 'express'
import { controller, validator, permissions } from '@/middlewares'
import { accessTokenAuth } from '@/middlewares/auth'
import { findAll, findOne, createOne, updateOne, deleteOne } from '@/middlewares/db'
import Role from '@/models/role'
import { RoleForm } from '@/forms/roles'
import { UrlForm } from '@/forms'
import { recordParam } from '@/utils/urlBuilder'

const router = Router()

router.get('/roles',
    accessTokenAuth,
    permissions('roles.read'),
    findAll(Role),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.get(`/roles/${recordParam}`,
    accessTokenAuth,
    permissions('roles.read'), 
    validator(UrlForm),
    findOne(Role),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.post('/roles',
    accessTokenAuth,
    permissions('roles.write'),
    validator(RoleForm),
    createOne(Role, ['name', 'permissions', 'slug']),
    controller(async (req, res) => {
        res.status(201).send({
            data: req.data,
            message: req.t('createdSuccessfully'),
        })
    })
)

router.put(`/roles/${recordParam}`,
    accessTokenAuth,
    permissions('roles.write'),
    validator(UrlForm),
    validator(RoleForm),
    updateOne(Role, ['name', 'permissions', 'slug']),
    controller(async (req, res) => {
        res.status(200).send({
            message: req.t('updatedSuccessfully'),
        })
    })
)

router.delete(`/roles/${recordParam}`,
    accessTokenAuth,
    permissions('roles.write'), 
    validator(UrlForm),
    deleteOne(Role),
    controller(async (req, res) => {
        res.status(200).send({
            message: req.t('removedSuccessfully'),
        })
    })
)

export default router
