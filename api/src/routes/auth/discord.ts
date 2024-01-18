import axios from 'axios'
import config from '@/config'
import { generateOAuth2Router } from '@/services/oauth2'

export default generateOAuth2Router({
    provider: 'discord',
    authorizationUrl: 'https://discord.com/api/v10/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/v10/oauth2/token',
    redirectUri: config.oauth2.discord.redirectUri,
    clientId: config.oauth2.discord.clientId,
    clientSecret: config.oauth2.discord.clientSecret,
    scope: ['identify', 'email'],
    params: {
        prompt: 'none'
    },
    async getUserDetails(accessToken) {        
        const res = await axios.get('http://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        const { id, avatar, username, email } = res.data
        return {
            id,
            email,
            name: username,
            avatarUrl: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
        }
    }
})
