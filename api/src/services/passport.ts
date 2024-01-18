import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import RefreshToken from '@/models/refresh-token'
import User from '@/models/user'
import { jwtAccessToken } from '@/services/jwt'

export default () => {
    passport.use('login', User.createStrategy())

    passport.use('access-token', new BearerStrategy(
        async (token, done) => {
            const payload = jwtAccessToken.verify(token)
            if (!payload) {
                return done(null, false)
            } 

            const user = await User.findById(payload.id).populate('role')
            done(null, user)
        }
    ))

    passport.use('refresh-token', new BearerStrategy(
        async (token, done) => {
            try {
                const refreshToken: any = await RefreshToken.findOneAndDelete({ token }).populate('owner')
                if (!refreshToken || refreshToken.validUntil < new Date()) {
                    return done(null, false)
                }
                
                done(null, refreshToken.owner)
            } catch (err) {
                done(err)
            }
        }
    ))
}
