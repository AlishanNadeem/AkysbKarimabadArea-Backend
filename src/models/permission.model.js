import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { ENUM_PERMISSIONS } from '../utils/index.js'

dotenv.config()

const permission_schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    key: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ENUM_PERMISSIONS
    },
    description: {
        type: String,
        trim: true
    },
    module: {
        type: String,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
})

permission_schema.index({ key: 1 }, { unique: true })

const Permission = mongoose.model('Permission', permission_schema)

export default Permission
