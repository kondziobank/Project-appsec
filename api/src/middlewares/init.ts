import { Request, Response, NextFunction } from 'express'
import { AlreadyInitializedAppException, UninitializedAppException } from '@/exceptions'
import Role from '@/models/role'

export async function isAppInitialized() {
    const role = await Role.exists({})
    return role != null
}

export async function assertAppInitialized(req: Request, _res: Response, next: NextFunction) {
    const initialized = await isAppInitialized()
    if (!initialized) {
        throw new UninitializedAppException(req)
    }

    next()
}

export async function assertAppUninitialized(req: Request, _res: Response, next: NextFunction) {
    const initialized = await isAppInitialized()
    if (initialized) {
        throw new AlreadyInitializedAppException(req)
    }

    next()
}
