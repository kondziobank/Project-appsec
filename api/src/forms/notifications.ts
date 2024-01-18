import { Request } from 'express'
import { ArrayField, FieldLocation, NotEmptyStringField} from '@/forms/fields'

export const NotificationForm = (req: Request) => [
    NotEmptyStringField(req, { path: 'content', in: FieldLocation.Body }),
    ArrayField(req, { path: 'roles', in: FieldLocation.Body }),
    NotEmptyStringField(req, { path: 'roles.*', in: FieldLocation.Body })
]
