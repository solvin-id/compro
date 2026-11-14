import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { users, type SafeUser } from '@/db/schema'
import { env } from '@/env'

const MOCK_ADMINS: SafeUser[] = [
  {
    id: 'dev-user-001',
    email: 'admin@solvin.dev',
    name: 'Dev Admin',
    role: 'admin',
    avatar: null,
    createdAt: new Date(),
  },
  {
    id: 'dev-user-002',
    email: 'editor@solvin.dev',
    name: 'Dev Editor',
    role: 'editor',
    avatar: null,
    createdAt: new Date('2024-11-15'),
  },
]

let devAdmins = [...MOCK_ADMINS]
let nextDevId = 3

const createAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'editor']).default('admin'),
  avatar: z.string().url().optional().or(z.literal('')),
})

const updateAdminSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  name: z.string().min(1).optional(),
  role: z.enum(['admin', 'editor']).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
})

const idSchema = z.object({
  id: z.string(),
})

export const getAdminsFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<SafeUser[]> => {
  if (!env.BACKEND_ENABLED) {
    console.log('[BACKEND OFF] Returning mock admins')
    return devAdmins
  }

  const admins = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  })
  return admins
})

export const getAdminFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<SafeUser | null> => {
    if (!env.BACKEND_ENABLED) {
      console.log('[BACKEND OFF] Finding mock admin by ID:', data.id)
      return devAdmins.find((a) => a.id === data.id) || null
    }

    const admin = await db.query.users.findFirst({
      where: eq(users.id, data.id),
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    })
    return admin || null
  })

export const createAdminFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => createAdminSchema.parse(data))
  .handler(async ({ data }): Promise<SafeUser | { error: string }> => {
    if (!env.BACKEND_ENABLED) {
      console.log('[BACKEND OFF] Creating mock admin:', data.name)

      if (devAdmins.some((a) => a.email === data.email.toLowerCase())) {
        return { error: 'Email already exists' }
      }

      const newAdmin: SafeUser = {
        id: `dev-user-${String(nextDevId++).padStart(3, '0')}`,
        email: data.email.toLowerCase(),
        name: data.name,
        role: data.role || 'admin',
        avatar: data.avatar || null,
        createdAt: new Date(),
      }
      devAdmins.push(newAdmin)
      return newAdmin
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    })

    if (existing) {
      return { error: 'Email already exists' }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const [admin] = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        role: data.role || 'admin',
        avatar: data.avatar || null,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })

    return admin
  })

export const updateAdminFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updateAdminSchema.parse(data))
  .handler(async ({ data }): Promise<SafeUser | { error: string }> => {
    const { id, password, ...updateData } = data

    if (!env.BACKEND_ENABLED) {
      console.log('[BACKEND OFF] Updating mock admin:', id)
      const index = devAdmins.findIndex((a) => a.id === id)
      if (index === -1) {
        return { error: 'Admin not found' }
      }

      if (updateData.email && updateData.email !== devAdmins[index].email) {
        if (
          devAdmins.some((a) => a.email === updateData.email!.toLowerCase())
        ) {
          return { error: 'Email already exists' }
        }
      }

      devAdmins[index] = {
        ...devAdmins[index],
        ...updateData,
        email: updateData.email?.toLowerCase() || devAdmins[index].email,
      }
      return devAdmins[index]
    }

    if (updateData.email) {
      const existing = await db.query.users.findFirst({
        where: eq(users.email, updateData.email.toLowerCase()),
      })
      if (existing && existing.id !== id) {
        return { error: 'Email already exists' }
      }
    }

    const updateValues: Record<string, unknown> = {
      ...updateData,
    }

    if (updateData.email) {
      updateValues.email = updateData.email.toLowerCase()
    }

    if (password && password.length >= 6) {
      updateValues.password = await bcrypt.hash(password, 12)
    }

    const [admin] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })

    return admin
  })

export const deleteAdminFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    if (!env.BACKEND_ENABLED) {
      console.log('[BACKEND OFF] Deleting mock admin:', data.id)

      if (devAdmins.length <= 1) {
        return { success: false, error: 'Cannot delete the last admin' }
      }

      devAdmins = devAdmins.filter((a) => a.id !== data.id)
      return { success: true }
    }

    const adminCount = await db.query.users.findMany()
    if (adminCount.length <= 1) {
      return { success: false, error: 'Cannot delete the last admin' }
    }

    await db.delete(users).where(eq(users.id, data.id))
    return { success: true }
  })
