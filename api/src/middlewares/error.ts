import { Request, Response, NextFunction } from 'express'
import logger from '@/services/logger';
import { Exception, PublicException, RouteNotFoundException, translateException } from '@/exceptions';

export function notFoundRoute(req: Request, _res: Response) {
    throw new RouteNotFoundException(req)
}

export function catchExceptions(err: any, req: Request, res: Response, _next: NextFunction) {
    err = translateException(req, err)
    const message = err instanceof PublicException ? err.message : req.t('internalError')
    const status = err instanceof Exception ? err.status : 500
    const meta = err instanceof PublicException ? err.metadata : undefined

    res.status(status).send({ message, meta })

    if (!(err instanceof Exception)) {
        // At the moment only unknown errors are logged
        logger.error(err)
    }
}
