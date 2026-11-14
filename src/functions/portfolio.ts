import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc, asc } from 'drizzle-orm'
import { db } from '@/db'
import { portfolio, type Portfolio, type NewPortfolio } from '@/db/schema'
import { env } from '@/env'
import {
  uploadFile,
  deleteFile,
  generateObjectKey,
  isStorageConfigured,
} from '@/utils/storage'

// Mock data for DEV_MODE
const MOCK_PORTFOLIO: Portfolio[] = [
  {
    id: 1,
    slug: 'medicore-systems',
    title: 'MediCore Systems',
    year: '2024',
    sector: 'Medical',
    description: 'AI-powered patient triage and management platform.',
    client: 'Grand Hospital Jakarta',
    problem:
      'Patient queue times triggered complaints; manual triage was error-prone.',
    solution:
      'A real-time queue management system with AI-assisted symptom triage.',
    outcome: 'Wait times reduced by 40%, patient satisfaction up by 25%.',
    techStack: JSON.stringify([
      'React',
      'Node.js',
      'TensorFlow.js',
      'PostgreSQL',
    ]),
    image: null,
    status: 'published',
    displayOrder: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    slug: 'finflow-global',
    title: 'FinFlow Global',
    year: '2023',
    sector: 'Fintech',
    description: 'Real-time cross-border payment processing infrastructure.',
    client: 'FinFlow Asia',
    problem:
      'Legacy system had high latency and failed 5% of cross-border transactions.',
    solution:
      'Go-based microservices architecture with Kafka for event streaming.',
    outcome:
      'Transaction success rate hitting 99.99%, latency dropped to <200ms.',
    techStack: JSON.stringify(['Go', 'Kafka', 'Redis', 'Kubernetes']),
    image: null,
    status: 'published',
    displayOrder: 2,
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2023-06-20'),
  },
  {
    id: 3,
    slug: 'luxstay-resorts',
    title: 'LuxStay Resorts',
    year: '2024',
    sector: 'Hospitality',
    description: 'Immersive booking experience for ultra-luxury destinations.',
    client: 'LuxStay Group',
    problem:
      'Generic booking engine did not reflect the premium brand identity.',
    solution: 'Bespoke booking engine with WebGL visualizations of villas.',
    outcome: 'Direct bookings increased by 60%, reducing OTA commission fees.',
    techStack: JSON.stringify(['Next.js', 'Three.js', 'Sanity CMS', 'Stripe']),
    image: null,
    status: 'published',
    displayOrder: 3,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
]

let devPortfolio = [...MOCK_PORTFOLIO]
let nextDevId = 4

// Schemas
const createPortfolioSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  title: z.string().min(1, 'Title is required'),
  year: z.string().min(1, 'Year is required'),
  sector: z.string().min(1, 'Sector is required'),
  description: z.string().min(1, 'Description is required'),
  client: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
  techStack: z.string().optional(), // JSON string
  image: z.string().optional(), // Object key from RustFS
  status: z.enum(['draft', 'published']).default('draft'),
  displayOrder: z.number().optional(),
})

const updatePortfolioSchema = createPortfolioSchema.partial().extend({
  id: z.number(),
})

const idSchema = z.object({
  id: z.number(),
})

// Helper to parse techStack
function parseTechStack(techStack: string | null | undefined): string[] {
  if (!techStack) return []
  try {
    return JSON.parse(techStack)
  } catch {
    return []
  }
}

/**
 * Get all portfolio items (admin - includes drafts)
 */
export const getPortfolioItemsFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Portfolio[]> => {
  if (!env.BACKEND_ENABLED) {
    console.log('[DEV MODE] Returning mock portfolio items')
    return devPortfolio.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
    )
  }

  return db.query.portfolio.findMany({
    orderBy: [asc(portfolio.displayOrder), desc(portfolio.createdAt)],
  })
})

/**
 * Get published portfolio items (public)
 */
export const getPublishedPortfolioFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Portfolio[]> => {
  if (!env.BACKEND_ENABLED) {
    console.log('[DEV MODE] Returning published mock portfolio items')
    return devPortfolio
      .filter((p) => p.status === 'published')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }

  return db.query.portfolio.findMany({
    where: eq(portfolio.status, 'published'),
    orderBy: [asc(portfolio.displayOrder), desc(portfolio.createdAt)],
  })
})

/**
 * Get portfolio item by ID
 */
export const getPortfolioItemFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<Portfolio | null> => {
    if (!env.BACKEND_ENABLED) {
      console.log('[DEV MODE] Finding mock portfolio by ID:', data.id)
      return devPortfolio.find((p) => p.id === data.id) || null
    }

    const item = await db.query.portfolio.findFirst({
      where: eq(portfolio.id, data.id),
    })
    return item || null
  })

/**
 * Create portfolio item
 */
export const createPortfolioFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => createPortfolioSchema.parse(data))
  .handler(async ({ data }): Promise<Portfolio | { error: string }> => {
    if (!env.BACKEND_ENABLED) {
      console.log('[DEV MODE] Creating mock portfolio:', data.title)
      const newItem: Portfolio = {
        id: nextDevId++,
        slug: data.slug,
        title: data.title,
        year: data.year,
        sector: data.sector,
        description: data.description,
        client: data.client || null,
        problem: data.problem || null,
        solution: data.solution || null,
        outcome: data.outcome || null,
        techStack: data.techStack || null,
        image: data.image || null,
        status: data.status,
        displayOrder: data.displayOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      devPortfolio.push(newItem)
      return newItem
    }

    const [item] = await db
      .insert(portfolio)
      .values({
        ...data,
        client: data.client || null,
        problem: data.problem || null,
        solution: data.solution || null,
        outcome: data.outcome || null,
        techStack: data.techStack || null,
        image: data.image || null,
        displayOrder: data.displayOrder || 0,
      } as NewPortfolio)
      .returning()

    return item
  })

/**
 * Update portfolio item
 */
export const updatePortfolioFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updatePortfolioSchema.parse(data))
  .handler(async ({ data }): Promise<Portfolio | { error: string }> => {
    const { id, ...updateData } = data

    if (!env.BACKEND_ENABLED) {
      console.log('[DEV MODE] Updating mock portfolio:', id)
      const index = devPortfolio.findIndex((p) => p.id === id)
      if (index === -1) {
        return { error: 'Portfolio item not found' }
      }

      const oldImage = devPortfolio[index].image

      devPortfolio[index] = {
        ...devPortfolio[index],
        ...updateData,
        updatedAt: new Date(),
      }

      // Clean up old image if changed
      if (
        isStorageConfigured() &&
        updateData.image !== undefined &&
        oldImage?.startsWith('portfolio/') &&
        updateData.image !== oldImage
      ) {
        await deleteFile(oldImage)
      }

      return devPortfolio[index]
    }

    // Get current item to track old image
    const currentItem = await db.query.portfolio.findFirst({
      where: eq(portfolio.id, id),
    })

    if (!currentItem) {
      return { error: 'Portfolio item not found' }
    }

    const oldImage = currentItem.image

    const [item] = await db
      .update(portfolio)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.id, id))
      .returning()

    // Clean up old image if changed
    if (
      isStorageConfigured() &&
      updateData.image !== undefined &&
      oldImage?.startsWith('portfolio/') &&
      updateData.image !== oldImage
    ) {
      await deleteFile(oldImage)
    }

    return item
  })

/**
 * Delete portfolio item
 */
export const deletePortfolioFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    if (!env.BACKEND_ENABLED) {
      console.log('[DEV MODE] Deleting mock portfolio:', data.id)
      const item = devPortfolio.find((p) => p.id === data.id)

      // Clean up storage
      if (
        item &&
        isStorageConfigured() &&
        item.image?.startsWith('portfolio/')
      ) {
        await deleteFile(item.image)
      }

      devPortfolio = devPortfolio.filter((p) => p.id !== data.id)
      return { success: true }
    }

    // Get item to find storage key
    const item = await db.query.portfolio.findFirst({
      where: eq(portfolio.id, data.id),
    })

    // Delete from database
    await db.delete(portfolio).where(eq(portfolio.id, data.id))

    // Clean up storage
    if (item && isStorageConfigured() && item.image?.startsWith('portfolio/')) {
      await deleteFile(item.image)
    }

    return { success: true }
  })

/**
 * Upload portfolio image
 */
export const uploadPortfolioImageFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => {
    const schema = z.object({
      base64Data: z.string(),
      filename: z.string(),
      contentType: z.string(),
    })
    return schema.parse(data)
  })
  .handler(async ({ data }): Promise<{ key: string } | { error: string }> => {
    if (!isStorageConfigured()) {
      return { error: 'Storage is not configured' }
    }

    try {
      const buffer = Buffer.from(data.base64Data, 'base64')
      const key = generateObjectKey(data.filename, 'portfolio')
      const result = await uploadFile(buffer, key, data.contentType)

      if (!result) {
        return { error: 'Failed to upload image' }
      }

      return { key: result }
    } catch (error) {
      console.error('[uploadPortfolioImageFn] Error:', error)
      return { error: 'Upload failed' }
    }
  })
