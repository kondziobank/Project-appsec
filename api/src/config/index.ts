export default {
    appName: 'Web Crypto Center',
    port: process.env.PORT!!,
    jwtSecret: process.env.JWT_SECRET!!,
    accessTokenLifetimeSeconds: 300 * 1000,
    refreshTokenLifetimeSeconds: 24 * 60 * 60,
    refreshTokenBytesNumber: 32,

    // Format compatible with isStrongPassword function from package 'validator'
    passwordPolicy: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    },

    mongodb: {
        username: process.env.MONGO_USERNAME!!,
        password: process.env.MONGO_PASSWORD!!,
        database: process.env.MONGO_DATABASE!!,
        hostname: process.env.MONGO_HOST!!,
        port: process.env.MONGO_PORT!!,
        get url() {
            return `mongodb://${this.username}:${this.password}@${this.hostname}:${this.port}/${this.database}`
        }
    },

    // Valid permissions identifiers
    permissions: [
        'users.read',
        'users.write',
        'roles.read',
        'roles.write',
        'uploads.read',
        'uploads.write',
        'articles.read',
        'articles.readPrivate',
        'articles.write',

        // read ALL sent notifications, but everyone can read notification send to him directly
        'notifications.read',
        'notifications.send',
    ],

    roles: {
        builtIn: {
            unverified: 'unverified',
            reader: 'reader',
            writer: 'writer',
            admin: 'admin',
        }
    },

    i18n: {
        defaultLanguage: 'en',
    },

    oauth2: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!!,
            redirectUri: process.env.DISCORD_REDIRECT_URI!!,            
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID!!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!!,
            redirectUri: process.env.FACEBOOK_REDIRECT_URI!!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!!,
            redirectUri: process.env.GOOGLE_REDIRECT_URI!!,
        },
    },

    mailer: {
        smtp: {
            host: process.env.SMTP_HOST!!,
            port: Number(process.env.SMTP_PORT!!),
            secure: Number(process.env.SMTP_SECURE!!) != 0
        },
        auth: {
            user: process.env.SMTP_USER!!,
            pass: process.env.SMTP_PASSWORD!!,
        }
    },

    frontendUrl: process.env.FRONTEND_URL,
    emailConfirmationUrl(token: string) {
        return `${this.frontendUrl}/confirm/${token}`
    },
    resetPasswordUrl(token: string) {
        return `${this.frontendUrl}/reset-password/${token}`
    },
}
