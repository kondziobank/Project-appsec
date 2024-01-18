import { Request, Response, NextFunction } from 'express'

export default function checkPermissions(...permissions: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user: any = req.user
        await user.populate('role')
        if (user.role.builtIn && user.role.slug === 'admin') {
            return next()
        }

        const supported = (p: string) => user.role.permissions.includes(p)

        for (const permission of permissions) {
            if (!supported(permission)) {
                return res.status(403).send({
                    message: req.t('forbidden')
                })
            }
        }

        next()
    }
}
