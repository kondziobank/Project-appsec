import { Request } from 'express'

interface IExceptionMetadata {
    [key: string]: any
}

// Class defintion is based on the following answer:
// https://stackoverflow.com/a/32749533
export class Exception extends Error {
    status: number
    metadata: IExceptionMetadata | undefined

    constructor(message: string, status: number, metadata?: IExceptionMetadata) {
        super(message);
        this.name = this.constructor.name;
        this.status = status
        this.metadata = metadata

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = (new Error(message)).stack; 
        }
    }
}

// Public exception's message is visible to API user
export class PublicException extends Exception {
}

export class UninitializedAppException extends PublicException {
    constructor(req: Request) {
        super(req.t('appNotInitializedYet'), 403)
    }
}

export class AlreadyInitializedAppException extends PublicException {
    constructor(req: Request) {
        super(req.t('appAlreadyInitialized'), 403)
    }
}

export class JsonParsingException extends PublicException {
    constructor(req: Request) {
        super(req.t('invalidJson'), 400)
    }
}

export class DuplicatedRecordException extends PublicException {
    constructor(req: Request, fields: string[]) {
        const list = fields.join(', ')
        super(`${req.t('fieldsNotUnique')}: ${list}`, 409)
    }
}

export class UnauthenticatedException extends PublicException {
    constructor(req: Request) {
        super(req.t('unauthenticated'), 401)
    }
}

export class ForbiddenException extends PublicException {
    constructor(req: Request) {
        super(req.t('forbidden'), 403)
    }
}
export class ResourceNotFoundException extends PublicException {
    constructor(req: Request) {
        super(req.t('resourceNotFound'), 404, {
            type: 'resource',
        })
    }
}

export class RouteNotFoundException extends PublicException {
    constructor(req: Request) {
        super(req.t('routeNotFound'), 404, {
            type: 'route',
        })
    }
}

export function translateException(req: Request, err: any) {
    if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
        return new JsonParsingException(req)
    } else if (err.name === 'UserExistsError') {
        return new PublicException(err.message, 409)
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
        const fields = Object.keys(err.keyPattern)
        return new DuplicatedRecordException(req, fields)
    } else {
        return err
    }
}
