import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

config()

import { users } from '../src/db/schema'

const ADMIN_EMAIL = 'admin@solvin.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_NAME = 'Admin Solvin'

async function seedAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env')
    process.exit(1)
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  const db = drizzle(pool)

  console.log('🔐 Hashing password...')
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

  console.log('👤 Creating admin user...')

  try {
    const [user] = await db
      .insert(users)
      .values({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'admin',
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          password: hashedPassword,
          name: ADMIN_NAME,
        },
      })
      .returning({ id: users.id, email: users.email, name: users.name })

    console.log('✅ Admin user created/updated successfully!')
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   ID: ${user.id}`)
    console.log('')
    console.log('🔑 Login credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('')
    console.log('⚠️  Remember to change the password in production!')
  } catch (error: any) {
    console.error('❌ Failed to create admin user:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seedAdmin()
