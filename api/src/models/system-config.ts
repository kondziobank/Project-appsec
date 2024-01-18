import mongoose from 'mongoose'

const SystemConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('SystemConfig', SystemConfigSchema)
