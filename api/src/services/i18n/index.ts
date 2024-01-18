import path from 'path'
import { loadDirectoryModules } from '@/utils/directoryLoader'

export interface Translation {
    lang: string,
    translations: {
        [key: string]: string
    }
}

interface AllTranslations {
    [key: string]: {
        [key: string]: string
    }
}

const translations: AllTranslations = {}

export async function init() {
    const modules = await loadDirectoryModules(path.join(__dirname, 'translations'), []) as Translation[]
    for (const module of modules) {
        translations[module.lang] = module.translations
    }
}

export function getSupportedLanguages() {
    return Object.keys(translations)
}

export function translate(language: string, label: string): string {
    return translations[language][label]
}
