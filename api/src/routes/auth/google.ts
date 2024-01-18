import axios from 'axios'
import config from '@/config'
import { generateOAuth2Router } from '@/services/oauth2'

export default generateOAuth2Router({
    provider: 'google',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://accounts.google.com/o/oauth2/token',
    redirectUri: config.oauth2.google.redirectUri,
    clientId: config.oauth2.google.clientId,
    clientSecret: config.oauth2.google.clientSecret,
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ],
    async getUserDetails(accessToken) {
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        const { sub, name, picture, email } = res.data
        return {
            id: sub,
            email,
            name,
            avatarUrl: picture
        }
    }
})
