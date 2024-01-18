import mongoose from 'mongoose'
import crypto from 'crypto'
import config from '@/config'
import NamedSchema from '@/services/database/plugins/named-schema'
import SluggableSchema from '@/services/database/plugins/sluggable-schema'

const UploadedFileMeta = new mongoose.Schema({
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
}, { _id: false })

const UploadSchema = new mongoose.Schema({
    description: { type: String },
    meta: UploadedFileMeta,
    publicToken: { type: String, required: true },
    public: { type: Boolean, required: true }
}, {
    timestamps: true
})

UploadSchema.pre('validate', function (next) {
    if (this.publicToken) {
        return next()
    }

    crypto.randomBytes(32, (_, buffer) => {
        this.publicToken = buffer.toString('hex')
        next()
    })
})

UploadSchema.plugin(NamedSchema)
UploadSchema.plugin(SluggableSchema, { sluggableField: 'name' })

export default mongoose.model('Upload', UploadSchema)
