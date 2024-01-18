import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import schema from '@/docs'

const router = Router()

router.use('/docs', swaggerUi.serve, swaggerUi.setup(schema));

export default router
