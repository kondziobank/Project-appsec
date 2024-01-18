import { Request, Response, NextFunction } from 'express'
import { ResourceNotFoundException } from '@/exceptions'
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            data: any
        }
    }
}

const prefixFieldMapping: { [key: string]: string } = {
    '~': '_id',
    '@': 'slug'
}

type MatchCallbackType = (field: string, value: string) => void

const matchParam = (req: Request, next: NextFunction) =>
    async (callback: MatchCallbackType) => {
        if ('prefix' in req.params && 'record' in req.params) {
            const dbField = prefixFieldMapping[req.params.prefix]
            const value = req.params.record
            await callback(dbField, value)
        }
    
        next()
    }

const filterObjectProperties = (object: { [key: string]: any }, fields: string[]) =>
    Object.fromEntries(
        Object.entries(object).filter(([key, _]) => fields.includes(key))
    )


export const findAll = (model: mongoose.Model<any>, queryModifier?: (query: any) => any) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        req.data = await (queryModifier ?? ((q: any) => q))(model.find())
        next()
    }

export const findOne = (model: mongoose.Model<any>, queryModifier?: (query: any) => any) =>
    async (req: Request, _res: Response, next: NextFunction) =>
        matchParam(req, next)(async (field, value) => {
            const data = await (queryModifier ?? ((q: any) => q))(model.findOne({ [field]: value }))
            if (!data) {
                throw new ResourceNotFoundException(req)
            }
            req.data = data
        })

export const createOne = (model: mongoose.Model<any>, fields: string[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        const insertedFields = filterObjectProperties(req.body, fields)
        req.data = await model.create(insertedFields)
        next()
    }

export const updateOne = (model: mongoose.Model<any>, fields: string[]) =>
    async (req: Request, _res: Response, next: NextFunction) =>
        matchParam(req, next)(async (field, value) => {
            // Can' use updateOne() at the moment because some plugins may does not implement pre('update') middleware
            const data = await model.findOne({ [field]: value });
            if (!data) {
                throw new ResourceNotFoundException(req)
            }

            for (const field of fields) {
                data[field] = req.body[field]
            }

            await data.save()
            req.data = data
        })

export const deleteOne = (model: mongoose.Model<any>) =>
    async (req: Request, _res: Response, next: NextFunction) =>
        matchParam(req, next)(async (field, value) => {
            const data = await model.findOne({ [field]: value });
            if (!data) {
                throw new ResourceNotFoundException(req)
            }

            await data.remove()
            req.data = data
        })
