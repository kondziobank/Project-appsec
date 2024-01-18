import { Request } from 'express'
import { EmailField, PasswordField, NotEmptyStringField, FieldLocation } from '@/forms/fields'

export const LoginForm = (req: Request) => [
    EmailField(req, { path: 'email', in: FieldLocation.Body }),
    PasswordField(req, { path: 'password', in: FieldLocation.Body }),
]

export const OAuth2Form = (req: Request) => [
    NotEmptyStringField(req, { path: 'code', in: FieldLocation.Body }),
    NotEmptyStringField(req, { path: 'state', in: FieldLocation.Body }),
]
