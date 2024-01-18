import jwt from 'jsonwebtoken'
import config from '@/config'

function JwtTokenType<T>(type: string) {
    return {
        sign(payload: T, settings?: jwt.SignOptions): string {
            return jwt.sign({ ...payload, type }, config.jwtSecret, settings)
        },
    
        verify(token: string): T | null {
            try {
                const payload: any = jwt.verify(token, config.jwtSecret)
                if (payload.type !== type) {
                    return null;
                } else {
                    const { type, ...rest } = payload
                    return rest
                }
            } catch (e) {
                return null;
            }
        },
    }
}

export const jwtAccessToken = JwtTokenType<{ id: string }>('access-token')
export const jwtEmailConfirmationToken = JwtTokenType<{ id: string }>('email-confirmation')
export const jwtResetPasswordToken = JwtTokenType<{ email: string }>('reset-password')
