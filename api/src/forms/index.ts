import { Request } from 'express'
import { NotEmptyStringField, FieldLocation, EmailField } from '@/forms/fields'
export { UrlForm } from '@/forms/_url'

export const TokenForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'token', in: FieldLocation.Param }),
]

export const EmailForm = (req: Request) => [
    EmailField(req, { path: 'email', in: FieldLocation.Any }),
]
