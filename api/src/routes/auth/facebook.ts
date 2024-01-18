import axios from 'axios'
import config from '@/config'
import { generateOAuth2Router } from '@/services/oauth2'

export default generateOAuth2Router({
    provider: 'facebook',
    authorizationUrl: 'https://www.facebook.com/v15.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v15.0/oauth/access_token',
    redirectUri: config.oauth2.facebook.redirectUri,
    clientId: config.oauth2.facebook.clientId,
    clientSecret: config.oauth2.facebook.clientSecret,
    scope: ['public_profile', 'email'],
    async getUserDetails(accessToken) {
        const res = await axios.get('https://graph.facebook.com/v14.0/me', {
            params: {
                fields: 'name,email,picture.width(400).height(400)',
                access_token: accessToken,
            }
        })
        const { id, picture, name, email } = res.data
        return {
            id,
            email,
            name,
            avatarUrl: picture.data.url
        }
    }
})
