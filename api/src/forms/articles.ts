import { Request } from 'express'
import { BooleanField, ArrayField, FieldLocation, NotEmptyStringField, JsonField, SlugField } from '@/forms/fields'

export const ArticleForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'name', in: FieldLocation.Body }),
    BooleanField(req, { path: 'public', in: FieldLocation.Body }),
    JsonField(req, { path: 'content', in: FieldLocation.Body }),
    ArrayField(req, { path: 'children', in: FieldLocation.Body, required: false }),
    NotEmptyStringField(req, { path: 'children.*', in: FieldLocation.Body }),
    SlugField(req, { path: 'slug', in: FieldLocation.Body, required: false }),
]
