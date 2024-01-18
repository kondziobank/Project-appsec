import { Router } from 'express'
import { loadDirectoryModules } from '@/utils/directoryLoader'

export default async () => {
    const router = Router()
    const modules = await loadDirectoryModules<Router>(__dirname, ['index', 'init'])
    modules.forEach(module => router.use(module))
    return router
}
