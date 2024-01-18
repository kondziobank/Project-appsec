import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'


export type ValidationChainFactory = (req: Request) => ValidationChain[]

export default function validator(rulesFactory: ValidationChainFactory) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const rules = rulesFactory(req)
        await Promise.all(rules.map(rule => rule.run(req)))

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: req.t('validationError'),
            })
        }

        next();
    }
}
