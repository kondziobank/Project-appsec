import { Request } from 'express'
import { ArrayField, FieldLocation, NotEmptyStringField, PermissionField, SlugField } from '@/forms/fields'

export const RoleForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'name', in: FieldLocation.Body }),
    ArrayField(req, { path: 'permissions', in: FieldLocation.Body }),
    PermissionField(req, { path: 'permissions.*', in: FieldLocation.Body }),
    SlugField(req, { path: 'slug', in: FieldLocation.Body, required: false })
]
