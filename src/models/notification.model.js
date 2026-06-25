import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const notification_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    meta: {
        type: Object,
        default: null,
    },
    type: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

notification_schema.index({ user: 1, read: 1, createdAt: -1 })

const Notification = mongoose.model('Notification', notification_schema)

export default Notification