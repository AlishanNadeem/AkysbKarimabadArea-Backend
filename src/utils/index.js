import { encryptData } from "../helpers/encryption.js"
import crypto from 'crypto'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// New

export const EVENT_TYPES = {
    AREA: 'area',
    LOCAL: 'local',
    REGIONAL: 'regional',
}

export const EVENT_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    POSTPONED: 'postponed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
}

export const REGISTRATION_STATUS = {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
}

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
}

export const PAYMENT_METHOD = {
    CASH: 'cash',
    ONLINE_TRANSFER: 'online_transfer',
}

export const ENUM_REGISTRATION_STATUS = Object.values(REGISTRATION_STATUS)
export const ENUM_PAYMENT_STATUS = Object.values(PAYMENT_STATUS)
export const ENUM_PAYMENT_METHOD = Object.values(PAYMENT_METHOD)
export const ENUM_EVENT_TYPES = Object.values(EVENT_TYPES)
export const ENUM_EVENT_STATUS = Object.values(EVENT_STATUS)

export const generateMembershipId = () => {

    const prefix = 'AKYSB-KAC'
    const random = Math.floor(10000 + Math.random() * 90000)
    return `${prefix}-${random}`

}

// end new

const AUTH_TYPES = {
    EMAIL: "email",
    GOOGLE: "google",
    APPLE: "apple",
}

const ENUM_AUTH_TYPES = Object.values(AUTH_TYPES)

export const USER_TYPES = {
    FREE: "free",
    PREMIUM: "premium"
}

export const ENUM_USER_TYPES = Object.values(USER_TYPES)

const MEDIA_TYPES = {
    PHOTO: "photo",
    VIDEO: "video",
    VOICE: "voice",
}

const ENUM_MEDIA_TYPES = Object.values(MEDIA_TYPES)

const MILESTONES = {
    FIRST_WORD: "First Word",
    FIRST_STEPS: "First Steps",
    STARTED_PRESCHOOL: "Started Preschool",
    LEARNED_TO_RIDE_BIKE: "Learned to Ride a Bike",
    WROTE_THEIR_NAME: "Wrote Their Name",
    READ_A_BOOK_ALONE: "Read a Book Alone",
    FIRST_DAY_OF_SCHOOL: "First Day of School",
    LOST_FIRST_TOOTH: "Lost First Tooth",
    LEARNED_TO_SWIM: "Learned to Swim",
    MADE_A_NEW_FRIEND: "Made a New Friend"
}

const ENUM_MILESTONES = Object.values(MILESTONES)

const PRIVILEGE = {
    VIEW: "view",
    COMMENT: "comment",
    CONTRIBUTE: "contribute"
}

const ENUM_PRIVILEGE = Object.values(PRIVILEGE)

const REQUEST_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    DECLINED: "declined"
}

const ENUM_REQUEST_STATUS = Object.values(REQUEST_STATUS)

export const RELATIONS = {
    FATHER: "father",
    MOTHER: "mother",
    GRANDMOTHER: "grandmother",
    GRANDFATHER: "grandfather"
}

export const ENUM_RELATIONS = Object.values(RELATIONS)

export const GENDERS = {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other"
}

export const ENUM_GENDERS = Object.values(GENDERS)

export const generatePassword = (length = 16) => {
    return Array.from(
        { length },
        () => CHARSET[crypto.randomInt(0, CHARSET.length)]
    ).join('')
}

const generateOtp = async (length = 6) => {

    if (length < 4 || length > 10) {
        throw new Error('OTP length must be between 4 and 10 digits')
    }

    const otp = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
    const hashed = await encryptData(otp)

    return { otp, hashed }

}

const searchRegex = (text, exact = false) => {

    if (!text) return /.*/

    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const pattern = exact ? `^${escaped}$` : escaped

    return new RegExp(pattern, 'i')

}

const buildDateRangeQuery = (from_date, to_date) => {

    if (!from_date && !to_date) return undefined

    const condition = {}

    if (from_date) condition['$gte'] = new Date(from_date)
    if (to_date) condition['$lte'] = new Date(to_date)

    return condition

}

const calculateAge = (date_of_birth) => {

    if (!date_of_birth) return { years: 0, months: 0, days: 0 }

    const dob = new Date(date_of_birth)
    const now = new Date()

    let years = now.getFullYear() - dob.getFullYear()
    let months = now.getMonth() - dob.getMonth()
    let days = now.getDate() - dob.getDate()

    if (days < 0) {
        months -= 1
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days += prevMonth.getDate()
    }

    if (months < 0) {
        years -= 1
        months += 12
    }

    return { years, months, days }

}

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const DUMMY_USER_IMAGE_PATH = "uploads/user/dummy.jpg"

export const ROLES = {
    ADMIN: "admin",
    USER: "user"
}

export const ENUM_ROLES = Object.values(ROLES)

export const PERMISSIONS = {
    USERS_READ: "users:read",
    USERS_CREATE: "users:create",
    USERS_DELETE: "users:delete",
    ROLES_READ: "roles:read",
    ROLES_CREATE: "roles:create",
    ROLES_DELETE: "roles:delete",
    NOTIFICATIONS_READ: "notifications:read",
    NOTIFICATIONS_CREATE: "notifications:create",
    FEEDBACK_READ: "feedback:read",
    FEEDBACK_CREATE: "feedback:create",
    EVENT_READ: "event:read",
    EVENT_CREATE: "event:create",
    REGISTRATION_CREATE: "registration:create",
}

export const ENUM_PERMISSIONS = Object.values(PERMISSIONS)

export const VISIT_TYPES = {
    IM_HERE: "im_here",
    GO_NOW: "go_now"
}

export const ENUM_VISIT_TYPES = Object.values(VISIT_TYPES)

export const MONETIZATION_TYPES = [
    { label: 'Streaming', value: 'flatrate' },
    { label: 'On TV', value: 'ads' },
    { label: 'For Rent', value: 'rent' },
    { label: 'In Theater', value: 'theater' },
]

export const getMediaUrl = (path) => {

    if (!path) return null

    if (path.startsWith('http')) return path

    return `${process.env.BASE_URL}${path}`

}

export const getTMDBMediaUrl = (path, size = "w500") => {

    return path
        ? `https://image.tmdb.org/t/p/${size}${path}`
        : null

}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const normalizeNumber = (count) => {

    if (!count && count !== 0) return null

    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`

    return count

}

export {
    AUTH_TYPES,
    ENUM_AUTH_TYPES,
    MEDIA_TYPES,
    ENUM_MEDIA_TYPES,
    MILESTONES,
    ENUM_MILESTONES,
    PRIVILEGE,
    ENUM_PRIVILEGE,
    REQUEST_STATUS,
    ENUM_REQUEST_STATUS,
    MONTHS,

    generateOtp,
    searchRegex,
    calculateAge,
    buildDateRangeQuery
}