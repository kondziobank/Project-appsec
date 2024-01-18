import multer from 'multer'
import path from 'path'
import { Router, Request, Response } from 'express'
import { accessTokenAuth } from '@/middlewares/auth'
import { controller, validator, permissions } from '@/middlewares'
import { findAll, findOne, createOne, updateOne, deleteOne } from '@/middlewares/db'
import { recordParam } from '@/utils/urlBuilder'
import { UrlForm, TokenForm } from '@/forms'
import Upload from '@/models/upload'
import { UploadForm } from '@/forms/uploads'
import { PublicException, ResourceNotFoundException } from '@/exceptions'


const router = Router()

router.get('/uploads',
    accessTokenAuth,
    permissions('uploads.read'),
    findAll(Upload),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.get(`/uploads/${recordParam}`,
    accessTokenAuth,
    permissions('uploads.read'),
    validator(UrlForm),
    findOne(Upload),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

router.post('/uploads',
    accessTokenAuth,
    permissions('uploads.write'),
    validator(UploadForm),
    createOne(Upload, ['name', 'slug', 'description', 'public']),
    controller(async (req, res) => {
        res.status(200).send({
            data: req.data,
            message: req.t('createdSuccessfully'),
        })
    })
)

const uploader = multer({ dest: 'uploads/' })
const downloader = (req: Request, res: Response) => {
    const meta = req.data.meta
    res.sendFile(path.resolve(meta.path), {
        headers: {
            'Content-Disposition': `inline; filename=${meta.originalName}`,
            'Content-Type': meta.mimeType,
        }
    })
}

router.get(`/uploads/${recordParam}/file`,
    accessTokenAuth,
    permissions('uploads.read'),
    validator(UrlForm),
    findOne(Upload),
    controller(async (req, res) => {
        if (!req.data.meta) {
            throw new PublicException(req.t('fileNotUploadedYet'), 404)
        }

        downloader(req, res)
    })
)

router.post(`/uploads/${recordParam}/file`,
    accessTokenAuth,
    permissions('uploads.write'),
    validator(UrlForm),
    findOne(Upload),
    (req, _res, next) => {
        if (req.data.meta) {
            throw new PublicException(req.t('fileAlreadyUploaded'), 409)
        }

        next()
    },
    uploader.single('file'),
    controller(async (req, res) => {
        if (!req?.file) {
            throw new PublicException(req.t('missingFile'), 400)
        }

        console.log(req.file);

        req.data.meta = {}
        req.data.meta.path = req.file.path
        req.data.meta.originalName = req.file.originalname
        req.data.meta.mimeType = req.file.mimetype
        await req.data.save()

        console.log(req.data);

        res.status(200).send({})
    })
)

router.put(`/uploads/${recordParam}`,
    accessTokenAuth,
    permissions('uploads.write'),
    validator(UrlForm),
    validator(UploadForm),
    updateOne(Upload, ['name', 'description', 'slug', 'public']),
    controller(async (req, res) => {
        res.status(200).send({
            message: req.t('updatedSuccessfully'),
        })
    })
)

router.delete(`/uploads/${recordParam}`,
    accessTokenAuth,
    permissions('uploads.write'),
    validator(UrlForm),
    deleteOne(Upload),
    controller(async (req, res) => {
        res.status(200).send({
            message: req.t('removedSuccessfully'),
        })
    })
)

router.get('/uploads/public/:token',
    validator(TokenForm),
    controller(async (req, res) => {
        req.data = await Upload.findOne({ publicToken: req.params.token })
        if (!req.data || !req.data.public) {
            throw new ResourceNotFoundException(req)
        }
        downloader(req, res)
    })
)

router.get('/uploads/public/:token',
    validator(TokenForm),
    controller(async (req, res) => {
        req.data = await Upload.findOne({ publicToken: req.params.token })
        if (!req.data || !req.data.public) {
            throw new ResourceNotFoundException(req)
        }

        const { _id, name, slug } = req.data
        res.status(200).send({
            data: { _id, name, slug }
        })
    })
)


export default router
