import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { articles, type Article, type NewArticle } from '@/db/schema'
import { env } from '@/env'
import {
  uploadContent,
  getFileContent,
  generateContentKey,
  isStorageConfigured,
  deleteFile,
} from '@/utils/storage'
import { notifySubscribersFn } from './newsletter'

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

const slugSchema = z.object({
  slug: z.string(),
})

// Public function to get published articles only (for public pages)
export const getPublishedArticlesFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Article[]> => {
  if (env.DEV_MODE) {
    console.log('[DEV MODE] Returning published mock articles')
    return devArticles.filter((a) => a.status === 'published')
  }

  return db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.publishedAt)],
  })
})

// Public function to get article by slug (for public article detail page)
export const getArticleBySlugFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => slugSchema.parse(data))
  .handler(async ({ data }): Promise<Article | null> => {
    let article: Article | null = null

    if (env.DEV_MODE) {
      console.log('[DEV MODE] Finding mock article by slug:', data.slug)
      article =
        devArticles.find(
          (a) => a.slug === data.slug && a.status === 'published',
        ) || null
    } else {
      const found = await db.query.articles.findFirst({
        where: eq(articles.slug, data.slug),
      })

      // Only return published articles for public view
      if (found && found.status === 'published') {
        article = found
      }
    }

    // Fetch content from storage if it's an object key
    if (article && article.content.startsWith('content/')) {
      const htmlContent = await getFileContent(article.content)
      if (htmlContent) {
        article = { ...article, content: htmlContent }
      }
    }

    return article
  })

// Admin function to get all articles (including drafts)
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
    let article: Article | null = null

    if (env.DEV_MODE) {
      console.log('[DEV MODE] Finding mock article by ID:', data.id)
      article = devArticles.find((a) => a.id === data.id) || null
    } else {
      const found = await db.query.articles.findFirst({
        where: eq(articles.id, data.id),
      })
      article = found || null
    }

    // Fetch content from storage if it's an object key
    if (article && article.content.startsWith('content/')) {
      const htmlContent = await getFileContent(article.content)
      if (htmlContent) {
        article = { ...article, content: htmlContent }
      }
    }

    return article
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

      // For dev mode, still upload to storage if configured
      if (isStorageConfigured()) {
        const contentKey = await uploadContent(
          data.content,
          generateContentKey(data.slug),
        )
        if (contentKey) {
          newArticle.content = contentKey
        }
      }

      return newArticle
    }

    // Step 1: Insert article into DB with raw content first
    const [article] = await db
      .insert(articles)
      .values({
        ...data,
        canonicalUrl: data.canonicalUrl || null,
        publishedAt: data.status === 'published' ? new Date() : null,
      } as NewArticle)
      .returning()

    // Notify subscribers if published
    if (article.status === 'published') {
      await notifySubscribersFn({
        data: {
          articleId: article.id,
          title: article.title,
          slug: article.slug,
          summary: article.summary,
        },
      })
    }

    // Step 2: Upload content to storage if configured
    if (isStorageConfigured()) {
      let needsUpdate = false
      let contentKey = article.content
      let coverImageKey = article.coverImage

      // Upload HTML content
      const uploadedContentKey = await uploadContent(
        data.content,
        generateContentKey(data.slug),
      )
      if (uploadedContentKey) {
        contentKey = uploadedContentKey
        needsUpdate = true
      }

      // Step 3: Update article with storage keys if uploads succeeded
      if (needsUpdate) {
        const [updatedArticle] = await db
          .update(articles)
          .set({
            content: contentKey,
            coverImage: coverImageKey,
            updatedAt: new Date(),
          })
          .where(eq(articles.id, article.id))
          .returning()

        return updatedArticle
      }
    }

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

      const oldContent = devArticles[index].content
      const oldCoverImage = devArticles[index].coverImage

      // Set publishedAt if status is being changed to published
      const shouldSetPublishedAt =
        updateData.status === 'published' &&
        devArticles[index].publishedAt === null

      devArticles[index] = {
        ...devArticles[index],
        ...updateData,
        publishedAt: shouldSetPublishedAt
          ? new Date()
          : devArticles[index].publishedAt,
        updatedAt: new Date(),
      }

      // Upload new content to storage if configured
      if (isStorageConfigured() && updateData.content) {
        const contentKey = await uploadContent(
          updateData.content,
          generateContentKey(updateData.slug || devArticles[index].slug),
        )
        if (contentKey) {
          // Delete old content file if it was in storage
          if (oldContent?.startsWith('content/')) {
            await deleteFile(oldContent)
          }
          devArticles[index].content = contentKey
        }
      }

      // Handle cover image cleanup if changed
      if (
        isStorageConfigured() &&
        updateData.coverImage !== undefined &&
        oldCoverImage?.startsWith('covers/') &&
        updateData.coverImage !== oldCoverImage
      ) {
        await deleteFile(oldCoverImage)
      }

      return devArticles[index]
    }

    // Step 1: Get current article to track old storage keys
    const currentArticle = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    })

    if (!currentArticle) {
      return { error: 'Article not found' }
    }

    const oldContentKey = currentArticle.content
    const oldCoverImageKey = currentArticle.coverImage

    // Step 2: Check if we need to set publishedAt
    let publishedAt: Date | null | undefined = undefined
    if (
      updateData.status === 'published' &&
      currentArticle.publishedAt === null
    ) {
      publishedAt = new Date()
    }

    // Step 3: Update article in DB with raw content first
    const [article] = await db
      .update(articles)
      .set({
        ...updateData,
        ...(publishedAt !== undefined && { publishedAt }),
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning()

    // Step 4: Upload new content to storage if configured
    if (isStorageConfigured() && updateData.content) {
      const contentKey = await uploadContent(
        updateData.content,
        generateContentKey(updateData.slug || article.slug),
      )

      if (contentKey) {
        // Delete old content file from storage if it was stored there
        if (
          oldContentKey?.startsWith('content/') &&
          oldContentKey !== contentKey
        ) {
          await deleteFile(oldContentKey)
        }

        // Update article with new content key
        const [updatedArticle] = await db
          .update(articles)
          .set({ content: contentKey, updatedAt: new Date() })
          .where(eq(articles.id, article.id))
          .returning()

        // Handle cover image cleanup if changed
        if (
          updateData.coverImage !== undefined &&
          oldCoverImageKey?.startsWith('covers/') &&
          updateData.coverImage !== oldCoverImageKey
        ) {
          await deleteFile(oldCoverImageKey)
        }

        return updatedArticle
      }
    }

    // Handle cover image cleanup if changed (when content upload didn't happen)
    if (
      isStorageConfigured() &&
      updateData.coverImage !== undefined &&
      oldCoverImageKey?.startsWith('covers/') &&
      updateData.coverImage !== oldCoverImageKey
    ) {
      await deleteFile(oldCoverImageKey)
    }

    return article
  })

export const deleteArticleFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    if (env.DEV_MODE) {
      console.log('[DEV MODE] Deleting mock article:', data.id)
      const article = devArticles.find((a) => a.id === data.id)

      // Clean up storage files in dev mode
      if (article && isStorageConfigured()) {
        if (article.content?.startsWith('content/')) {
          await deleteFile(article.content)
        }
        if (article.coverImage?.startsWith('covers/')) {
          await deleteFile(article.coverImage)
        }
      }

      devArticles = devArticles.filter((a) => a.id !== data.id)
      return { success: true }
    }

    // Get article to find storage keys before deleting
    const article = await db.query.articles.findFirst({
      where: eq(articles.id, data.id),
    })

    // Delete from database
    await db.delete(articles).where(eq(articles.id, data.id))

    // Clean up storage files
    if (article && isStorageConfigured()) {
      if (article.content?.startsWith('content/')) {
        await deleteFile(article.content)
      }
      if (article.coverImage?.startsWith('covers/')) {
        await deleteFile(article.coverImage)
      }
    }

    return { success: true }
  })
