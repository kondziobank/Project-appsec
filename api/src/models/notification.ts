import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
}, {
    timestamps: true
})

export default mongoose.model('Notification', NotificationSchema)
