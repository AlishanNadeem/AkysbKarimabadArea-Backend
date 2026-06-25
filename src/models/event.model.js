import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { ENUM_EVENT_STATUS, ENUM_EVENT_TYPES, EVENT_STATUS, getMediaUrl } from '../utils/index.js'

const event_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        enum: ENUM_EVENT_TYPES,
        required: true,
    },
    status: {
        type: String,
        enum: ENUM_EVENT_STATUS,
        default: EVENT_STATUS.PUBLISHED,
    },
    date: {
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
        },
    },
    time: {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
    },
    rescheduled: {
        date: {
            from: {
                type: Date,
                default: null,
            },
            to: {
                type: Date,
                default: null,
            },
        },
        time: {
            from: {
                type: String,
                default: null,
            },
            to: {
                type: String,
                default: null,
            },
        },
        reason: {
            type: String,
            trim: true,
            default: null,
        },
    },
    age: {
        from: {
            type: Number,
            min: 0,
            default: null,
        },
        to: {
            type: Number,
            min: 0,
            default: null,
        },
    },
    venue: {
        type: String,
        required: true,
        trim: true,
    },
    fees: {
        type: Number,
        min: 0,
        default: 0,
    },
    max_registrations: {
        enabled: {
            type: Boolean,
            default: false,
        },
        limit: {
            type: Number,
            min: 1,
            default: null,
        },
    },
    current_registrations: {
        type: Number,
        default: 0,
        min: 0,
    },
    registration_deadline: {
        type: Date,
        default: null,
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

event_schema.virtual('image_url').get(function () {
    return getMediaUrl(this.image)
})

event_schema.virtual('is_free').get(function () {
    return this.fees === 0
})

event_schema.virtual('is_full').get(function () {
    if (!this.max_registrations.enabled) return false
    return this.current_registrations >= this.max_registrations.limit
})

event_schema.virtual('is_registration_open').get(function () {
    if (!this.registration_deadline) return true
    return new Date() <= this.registration_deadline
})

event_schema.virtual('is_postponed').get(function () {
    return this.status === EVENT_STATUS.POSTPONED
})

event_schema.pre('save', function (next) {

    if (this.date.from && this.date.to && this.date.to < this.date.from) {
        return next(new Error('End date must be after start date.'))
    }

    if (this.age?.from && this.age?.to && this.age.to < this.age.from) {
        return next(new Error('Age "to" must be greater than age "from".'))
    }

    if (this.registration_deadline && this.registration_deadline > this.date.from) {
        return next(new Error('Registration deadline must be before event start date.'))
    }

    if (this.rescheduled.date.from && this.rescheduled.date.to && this.rescheduled.date.to < this.rescheduled.date.from) {
        return next(new Error('Rescheduled end date must be after rescheduled start date.'))
    }

    next()

})

event_schema.plugin(mongooseLeanVirtuals)

const Event = mongoose.model('Event', event_schema)

export default Event