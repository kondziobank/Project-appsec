import { Request } from 'express'
import { PasswordField, ConfirmPasswordField, FieldLocation, BooleanField } from '@/forms/fields'
export { UrlForm } from '@/forms/_url'

export const PasswordResetForm = (req: Request) => [
    PasswordField(req, { path: 'password', in: FieldLocation.Body }),
    ConfirmPasswordField(req, { path: 'confirmPassword', in: FieldLocation.Body }),
]

export const ReadNotificationForm = (req: Request) => [
    BooleanField(req, { path: 'read', in: FieldLocation.Body })
]
