import crypto from 'crypto'

export default function generateRandomToken(bytesNumber: number): string {
    return crypto.randomBytes(bytesNumber).toString('hex')
}
