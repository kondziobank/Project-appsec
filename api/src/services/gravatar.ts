import crypto from 'crypto'

export function getGravatarUrl(email: string) {
    const cleanedEmail = email.trim().toLowerCase()
    const hash = crypto.createHash('md5').update(cleanedEmail).digest('hex')
    const url = `https://www.gravatar.com/avatar/${hash}`
    return url
}
