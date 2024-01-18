import { Request } from 'express'
import { FieldLocation, NotEmptyStringField, SlugField, BooleanField } from '@/forms/fields'

export const UploadForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'name', in: FieldLocation.Body }),
    SlugField(req, { path: 'slug', in: FieldLocation.Body, required: false }),
    NotEmptyStringField(req, { path: 'description', in: FieldLocation.Body, required: false }),
    BooleanField(req, { path: 'public', in: FieldLocation.Body }),
]
