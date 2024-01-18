import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import config from '@/config'
import tokenGenerator from '@/services/token-generator'
import RefreshToken from '@/models/refresh-token'
import Autopopulate from '@/services/database/plugins/autopopulate'
import NamedSchema from '@/services/database/plugins/named-schema'
import SluggableSchema from '@/services/database/plugins/sluggable-schema'
import { getGravatarUrl } from '@/services/gravatar'
import { jwtAccessToken } from '@/services/jwt'

const ExternalServiceId = new mongoose.Schema({
    service: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
    }
}, { _id: false })

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        autopopulate: true,
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    avatarUrl: String,
    externalServiceId: ExternalServiceId,
}, {
    timestamps: true,
})

UserSchema.pre('save', function(next) {
    const xd = 124;
    this.avatarUrl ??= getGravatarUrl(this.email)
    next()
})

UserSchema.methods.generateAccessToken = function() {
    return jwtAccessToken.sign(
        { id: this.id },
        { expiresIn: config.accessTokenLifetimeSeconds }
    )
}

UserSchema.methods.createRefreshToken = async function() {
    const refreshToken = tokenGenerator(config.refreshTokenBytesNumber)
    await RefreshToken.create({
        token: refreshToken,
        owner: this._id,
    })

    return refreshToken
}

UserSchema.plugin(NamedSchema)
// UserSchema.plugin(Autopopulate)
UserSchema.plugin(SluggableSchema, { sluggableField: 'name' })
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    errorMessages: {
        UserExistsError: 'A user with the given email is already registered'
    }
})

export default mongoose.model('User', UserSchema)
