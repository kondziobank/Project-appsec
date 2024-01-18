import * as expressValidator from 'express-validator'
import { ValidationChain } from 'express-validator'
import { Request } from 'express'
import config from '@/config'

export enum FieldLocation {
    Any = 'check',
    Body = 'body',
    Cookie = 'cookie',
    Header = 'header',
    Param = 'param',
    Query = 'Query',
}

interface CustomFieldOptions {
    [key: string]: any
}

interface FieldDefaultOptions {
    required: boolean
}

interface FieldInstanceOptions {
    path: string
    in: FieldLocation
    required?: boolean
}

interface FieldOptions {
    path: string
    in: FieldLocation
    required: boolean
}

type FieldChainFactory = <T extends CustomFieldOptions>(f: ValidationChain, req: Request, options: FieldOptions & T) => ValidationChain

function getDefaultFieldOptions(): FieldDefaultOptions {
    return { required: true }
}

export const makeField = <T extends CustomFieldOptions>(chainFactory: FieldChainFactory) =>
    (req: Request, instanceOptions: FieldInstanceOptions & T) => {
        const defaultOptions = getDefaultFieldOptions()
        const options: FieldOptions & T = { ...defaultOptions, ...instanceOptions }

        let chain = (expressValidator as any)[options.in as string](options.path)
        if (!options.required) {
            chain = chain.optional()
        }

        return chainFactory(chain, req, options)
    }


export const EmailField = makeField((field, req) =>
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isString().withMessage(req.t('fieldMustBeString')).bail()
        .trim()
        .notEmpty().withMessage(req.t('fieldMustNotBeEmpty')).bail()
        .isEmail().withMessage(req.t('fieldMustBeEmail'))
)

export const PasswordField = makeField<{ checkComplexity?: boolean }>((field, req, options) =>
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isString().withMessage(req.t('fieldMustBeString')).bail()
        .notEmpty().withMessage(req.t('fieldMustNotBeEmpty')).bail()
        .if(() => options.checkComplexity ?? false)
        .isStrongPassword(config.passwordPolicy).withMessage(req.t('tooWeakPassword'))
)

export const ConfirmPasswordField = makeField((field, req) =>
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isString().withMessage(req.t('fieldMustBeString')).bail()
        .custom((value, { req }) => value === req.body.password).withMessage(req.t('confirmPasswordDifferent'))
)

export const ArrayField = makeField((field, req) => 
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isArray().withMessage(req.t('fieldMustBeArray'))
)

export const PermissionField = makeField((field, req) =>
    field.isString().withMessage(req.t('fieldMustBeString')).bail()
        .custom(value => config.permissions.includes(value)).withMessage(value => `${value} ${req.t('invalidPermission')}`)
)

export const NotEmptyStringField = makeField((field, req) => 
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isString().withMessage(req.t('fieldMustBeString')).bail()
        .trim()
        .notEmpty().withMessage(req.t('fieldMustNotBeEmpty'))
)

export const SlugField = makeField((field, req) => 
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isString().withMessage(req.t('fieldMustBeString')).bail()
        .trim()
        .notEmpty().withMessage(req.t('fieldMustNotBeEmpty')).bail()
        .isSlug().withMessage(req.t('invalidSlug'))
)

export const BooleanField = makeField((field, req) => 
    field.exists().withMessage(req.t('fieldRequired')).bail()
        .isBoolean().withMessage(req.t('fieldMustBeBoolean')).bail()
)

export const JsonField = makeField((field, req) => 
    field.exists().withMessage(req.t('fieldRequired')).bail()
)
