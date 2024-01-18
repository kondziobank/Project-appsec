import path from 'path'
import glob from 'glob-promise'

export async function loadDirectoryModules<T>(pathToDirectory: string, exclude: string[]): Promise<T[]> {
    const files = await glob(pathToDirectory + '/**/*')
    const modulePromises = files
        .filter(filename => !exclude.includes(path.parse(filename).name))
        .map(filename => import(filename))

    const modules = await Promise.all(modulePromises)
    return modules.map(module => module.default)
}
