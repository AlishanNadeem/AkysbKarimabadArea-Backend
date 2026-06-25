import mongoose from 'mongoose'
import { ENUM_PAYMENT_METHOD, ENUM_PAYMENT_STATUS, ENUM_REGISTRATION_STATUS, PAYMENT_STATUS, REGISTRATION_STATUS } from '../utils'

const registration_schema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
        required: true,
    },
    status: {
        type: String,
        enum: ENUM_REGISTRATION_STATUS,
        default: REGISTRATION_STATUS.ACTIVE,
    },
    amount_paid: {
        type: Number,
        required: true,
        default: 0,
    },
    payment: {
        status: {
            type: String,
            enum: ENUM_PAYMENT_STATUS,
            default: PAYMENT_STATUS.PENDING,
        },
        method: {
            type: String,
            enum: ENUM_PAYMENT_METHOD,
            default: null,
        },
        paid_at: {
            type: Date,
            default: null,
        },
        paid_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verified_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        verified_at: {
            type: Date,
            default: null,
        },
        notes: {
            type: String,
            trim: true,
            default: null,
        },
    },
    registered_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

registration_schema.virtual('is_free').get(function () {
    return this.fees_at_registration === 0
})

registration_schema.index({ event: 1, participant: 1 }, { unique: true })
registration_schema.index({ 'payment.status': 1 })

const Registration = mongoose.model('Registration', registration_schema)

export default Registration