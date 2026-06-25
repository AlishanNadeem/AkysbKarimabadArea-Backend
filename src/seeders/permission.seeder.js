import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Permission from '../models/permission.model.js'
import connectDB from '../config/db.js'
import { PERMISSIONS } from '../utils/index.js'

dotenv.config()

const permissions = [
    {
        name: 'Read Users',
        key: PERMISSIONS.USERS_READ,
        description: 'Allows viewing user accounts and profiles',
        module: 'users'
    },
    {
        name: 'Write Users',
        key: PERMISSIONS.USERS_WRITE,
        description: 'Allows creating and updating user accounts',
        module: 'users'
    },
    {
        name: 'Delete Users',
        key: PERMISSIONS.USERS_DELETE,
        description: 'Allows deleting user accounts',
        module: 'users'
    },
    {
        name: 'Read Roles',
        key: PERMISSIONS.ROLES_READ,
        description: 'Allows viewing roles and their permissions',
        module: 'roles'
    },
    {
        name: 'Write Roles',
        key: PERMISSIONS.ROLES_WRITE,
        description: 'Allows creating and updating roles',
        module: 'roles'
    },
    {
        name: 'Delete Roles',
        key: PERMISSIONS.ROLES_DELETE,
        description: 'Allows deleting roles',
        module: 'roles'
    },
    {
        name: 'Read Notifications',
        key: PERMISSIONS.NOTIFICATIONS_READ,
        description: 'Allows viewing notifications',
        module: 'notifications'
    },
    {
        name: 'Write Notifications',
        key: PERMISSIONS.NOTIFICATIONS_WRITE,
        description: 'Allows creating and sending notifications',
        module: 'notifications'
    },
    {
        name: 'Read Feedback',
        key: PERMISSIONS.FEEDBACK_READ,
        description: 'Allows viewing feedback submissions',
        module: 'feedback'
    },
    {
        name: 'Write Feedback',
        key: PERMISSIONS.FEEDBACK_WRITE,
        description: 'Allows submitting and managing feedback',
        module: 'feedback'
    },
]

const seedPermissions = async () => {
    try {

        await connectDB()
        console.log('🔗 Connected to MongoDB')

        let created = 0
        let skipped = 0

        for (const permission of permissions) {
            const exists = await Permission.findOne({ key: permission.key })
            if (exists) {
                console.log(`⏭️  Skipped: ${permission.key} (already exists)`)
                skipped++
            } else {
                await Permission.create(permission)
                console.log(`✅ Seeded: ${permission.key}`)
                created++
            }
        }

        console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`)
    } catch (error) {
        console.error('❌ Seeding failed:', error.message)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        console.log('🔌 Disconnected from MongoDB')
    }
}

seedPermissions()