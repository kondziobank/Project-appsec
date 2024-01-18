import mongoose from 'mongoose'

const SubscribentSchema = new mongoose.Schema({
    subscribent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true,
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    _id: false
})

export default mongoose.model('Subscribent', SubscribentSchema)
