import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/user.model.js'
import Role from '../models/role.model.js'
import { AUTH_TYPES, generatePassword } from '../utils/index.js'
import connectDB from '../config/db.js'
import { sendMail } from '../helpers/mail.js'

dotenv.config()

const users = [
    {
        name: 'Alishan Nadeem',
        email: 'alishan.nadeem22@gmail.com',
        role_slug: 'admin',
    }
]

const seedUsers = async () => {
    try {
        await connectDB()
        console.log('🔗 Connected to MongoDB')

        let created = 0
        let skipped = 0

        for (const user of users) {
            const exists = await User.findOne({ email: user.email })
            if (exists) {
                console.log(`⏭️  Skipped: ${user.email} (already exists)`)
                skipped++
                continue
            }

            const role = await Role.findOne({ slug: user.role_slug })
            if (!role) {
                console.warn(`⚠️  Role "${user.role_slug}" not found for ${user.email}. Run the roles seeder first.`)
                skipped++
                continue
            }

            const password = generatePassword()

            const new_user = new User({
                name: user.name,
                email: user.email,
                password,
                role: role._id,
                auth_provider: AUTH_TYPES.EMAIL,
                active: true
            })

            await new_user.save()

            await sendMail({
                to: user.email,
                subject: "Welcome to AKSYB Club",
                template: "signup",
                template_vars: {
                    name: user.name,
                    email: user.email,
                    password: password,
                    app_name: "AKSYB Club",
                    logo_url: "https://aksyb.club/uploads/logo.png",
                    login_url: "https://aksyb.club/login"
                }
            })

            console.log(`✅ Seeded: ${user.email} (role: ${user.role_slug})`)
            console.log(`   🔑 Password: ${password}`)
            created++
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

seedUsers()