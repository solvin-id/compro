import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { articles, type Article, type NewArticle } from '@/db/schema'
import { env } from '@/env'

const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'getting-started-with-tanstack',
    title: 'Getting Started with TanStack Start',
    content:
      '<p>TanStack Start is a powerful framework for building full-stack React applications...</p>',
    summary: 'Learn how to build modern web applications with TanStack Start.',
    category: 'Technology',
    coverImage: null,
    coverImageAlt: null,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    structuredDataType: 'Article',
    authorId: 'dev-user-001',
    authorName: 'Dev Admin',
    readTime: '5 min read',
    status: 'published',
    publishedAt: new Date('2024-12-01'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 2,
    slug: 'odoo-erp-best-practices',
    title: 'Odoo ERP Best Practices for Enterprise',
    content:
      '<p>Implementing Odoo ERP requires careful planning and execution...</p>',
    summary:
      'Best practices for implementing Odoo ERP in enterprise environments.',
    category: 'Business',
    coverImage: null,
    coverImageAlt: null,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    structuredDataType: 'Article',
    authorId: 'dev-user-001',
    authorName: 'Dev Admin',
    readTime: '8 min read',
    status: 'published',
    publishedAt: new Date('2024-11-15'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: 3,
    slug: 'draft-article-example',
    title: 'Draft Article Example',
    content: '<p>This is a draft article that is not yet published...</p>',
    summary: 'An example draft article for testing.',
    category: 'Draft',
    coverImage: null,
    coverImageAlt: null,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    structuredDataType: 'BlogPosting',
    authorId: 'dev-user-001',
    authorName: 'Dev Admin',
    readTime: '2 min read',
    status: 'draft',
    publishedAt: null,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
]

let devArticles = [...MOCK_ARTICLES]
let nextDevId = 4

const createArticleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().min(1, 'Summary is required'),
  category: z.string().min(1, 'Category is required'),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  structuredDataType: z
    .enum(['Article', 'NewsArticle', 'TechArticle', 'BlogPosting'])
    .optional(),
  authorId: z.string().min(1),
  authorName: z.string().min(1),
  readTime: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.number(),
})

const idSchema = z.object({
  id: z.number(),
})

export const getArticlesFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Article[]> => {
  if (env.DEV_MODE) {
    console.log('[DEV MODE] Returning mock articles')
    return devArticles
  }

  return db.query.articles.findMany({
    orderBy: [desc(articles.createdAt)],
  })
})

export const getArticleFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<Article | null> => {
    if (env.DEV_MODE) {
      console.log('[DEV MODE] Finding mock article by ID:', data.id)
      return devArticles.find((a) => a.id === data.id) || null
    }

    const article = await db.query.articles.findFirst({
      where: eq(articles.id, data.id),
    })
    return article || null
  })

export const createArticleFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => createArticleSchema.parse(data))
  .handler(async ({ data }): Promise<Article | { error: string }> => {
    if (env.DEV_MODE) {
      console.log('[DEV MODE] Creating mock article:', data.title)
      const newArticle: Article = {
        id: nextDevId++,
        slug: data.slug,
        title: data.title,
        content: data.content,
        summary: data.summary,
        category: data.category,
        coverImage: data.coverImage || null,
        coverImageAlt: data.coverImageAlt || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        structuredDataType: data.structuredDataType || 'Article',
        authorId: data.authorId,
        authorName: data.authorName,
        readTime: data.readTime || null,
        status: data.status,
        publishedAt: data.status === 'published' ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      devArticles.push(newArticle)
      return newArticle
    }

    const [article] = await db
      .insert(articles)
      .values({
        ...data,
        canonicalUrl: data.canonicalUrl || null,
      } as NewArticle)
      .returning()

    return article
  })

export const updateArticleFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updateArticleSchema.parse(data))
  .handler(async ({ data }): Promise<Article | { error: string }> => {
    const { id, ...updateData } = data

    if (env.DEV_MODE) {
      console.log('[DEV MODE] Updating mock article:', id)
      const index = devArticles.findIndex((a) => a.id === id)
      if (index === -1) {
        return { error: 'Article not found' }
      }
      devArticles[index] = {
        ...devArticles[index],
        ...updateData,
        updatedAt: new Date(),
      }
      return devArticles[index]
    }

    const [article] = await db
      .update(articles)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning()

    return article
  })

export const deleteArticleFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    if (env.DEV_MODE) {
      console.log('[DEV MODE] Deleting mock article:', data.id)
      devArticles = devArticles.filter((a) => a.id !== data.id)
      return { success: true }
    }

    await db.delete(articles).where(eq(articles.id, data.id))
    return { success: true }
  })
