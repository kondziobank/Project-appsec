import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

export function loginAuth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('login', { session: false })(req, res, next)
}

export function accessTokenAuth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('access-token', { session: false })(req, res, next)
}

export function refreshTokenAuth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('refresh-token', { session: false })(req, res, next)
}
