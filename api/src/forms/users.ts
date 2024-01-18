import { Request } from 'express'
import { EmailField, FieldLocation, NotEmptyStringField, PasswordField, ConfirmPasswordField, SlugField } from '@/forms/fields'

export const RegistrationForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'name', in: FieldLocation.Body }),
    EmailField(req, { path: 'email', in: FieldLocation.Body }),
    PasswordField(req, { path: 'password', in: FieldLocation.Body, checkComplexity: true }),
    ConfirmPasswordField(req, { path: 'confirmPassword', in: FieldLocation.Body }),
    SlugField(req, { path: 'slug', in: FieldLocation.Body, required: false })
]

export const UserUpdateForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'name', in: FieldLocation.Body }),
    NotEmptyStringField(req, { path: 'role', in: FieldLocation.Body }),
    SlugField(req, { path: 'slug', in: FieldLocation.Body, required: false }),
]

export const SelfUserUpdateForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'name', in: FieldLocation.Body }),
    SlugField(req, { path: 'slug', in: FieldLocation.Body, required: false }),
    SlugField(req, { path: 'avatarUrl', in: FieldLocation.Body, required: false }),
]
