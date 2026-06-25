import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Role from '../models/role.model.js'
import Permission from '../models/permission.model.js'
import connectDB from '../config/db.js'

dotenv.config()

const roles = [
    {
        name: 'Admin',
        slug: 'admin',
        description: 'Full access to all modules and permissions',
        is_system: true,
        is_admin: true
    },
    {
        name: 'Convenor',
        slug: 'convenor',
        description: 'Convenor role',
        is_system: true
    },
    {
        name: 'Co-Convenor',
        slug: 'co_convenor',
        description: 'Co-Convenor role',
        is_system: true
    },
    {
        name: 'Member Finance',
        slug: 'member_finance',
        description: 'Member Finance role',
        is_system: true
    },
    {
        name: 'Member',
        slug: 'member',
        description: 'Member role',
        is_system: true
    },
]

const seedRoles = async () => {
    try {
        await connectDB()
        console.log('🔗 Connected to MongoDB')

        const all_permissions = await Permission.find().select('_id')
        const all_permissions_ids = all_permissions.map(p => p._id)

        if (all_permissions_ids.length === 0) {
            console.warn('⚠️  No permissions found. Run the permissions seeder first.')
        }

        let created = 0
        let skipped = 0

        for (const { is_admin, ...role } of roles) {
            const exists = await Role.findOne({ slug: role.slug })
            if (exists) {
                console.log(`⏭️  Skipped: ${role.slug} (already exists)`)
                skipped++
            } else {
                await Role.create({
                    ...role,
                    permissions: is_admin ? all_permissions_ids : []
                })
                console.log(`✅ Seeded: ${role.slug}${is_admin ? ` (${all_permissions_ids.length} permissions assigned)` : ' (no permissions)'}`)
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

seedRoles()