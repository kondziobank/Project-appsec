import mongoose from 'mongoose'
import { Request } from 'express'
import { Meta, param } from 'express-validator'

const usedPrefix = (prefix: string) =>
    (_value: any, meta: Meta) => prefix === meta.req?.params?.prefix

const validMongoId = (value: any) =>
    mongoose.Types.ObjectId.isValid(value)

export const UrlForm = (req: Request) => [
    param('prefix').isWhitelisted('~@'),

    param('record')
        .if(usedPrefix('~'))
        .custom(validMongoId).withMessage(req.t('invalidObjectId')),

    param('record')
        .if(usedPrefix('~'))
        .isSlug().withMessage(req.t('invalidSlug')),
]
