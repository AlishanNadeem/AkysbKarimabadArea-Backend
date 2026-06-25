import mongoose from 'mongoose'
import { generateMembershipId } from '../utils/index.js'

const participant_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    phone: {
        country_code: {
            type: String,
            required: true,
            trim: true,
        },
        dialing_code: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
    },
    whatsapp: {
        country_code: {
            type: String,
            required: true,
            trim: true,
        },
        dialing_code: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
    },
    jamatkhana: {
        type: String,
        required: true,
        trim: true,
    },
    membership_id: {
        type: String,
        unique: true,
    },
    emergency_contact: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        relation: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            country_code: {
                type: String,
                required: true,
                trim: true,
            },
            dialing_code: {
                type: String,
                required: true,
                trim: true,
            },
            number: {
                type: String,
                required: true,
                trim: true,
            },
        }
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

participant_schema.pre('save', async function (next) {

    if (this.isNew) {

        let exists = true

        while (exists) {
            const membership_id = generateMembershipId()
            exists = await this.constructor.exists({ membership_id })

            if (!exists) {
                this.membership_id = membership_id
            }
        }
    }

    next()

})

participant_schema.index({ membership_id: 1 }, { unique: true })

const Participant = mongoose.model('Participant', participant_schema)

export default Participant