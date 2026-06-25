import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Permission from './permission.model.js'

dotenv.config()

const role_schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    is_system: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

role_schema.index({ slug: 1 }, { unique: true })

role_schema.statics.getPermissionKeys = async function (slug) {

    const role = await this.findOne({ slug, active: true })
        .populate('permissions')
        .lean()

    if (!role?.permissions?.length) return []

    return role.permissions.map((permission) => permission.key)

}

const Role = mongoose.model('Role', role_schema)

export default Role
