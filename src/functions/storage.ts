import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  uploadFile,
  uploadContent,
  getFileContent,
  deleteFile,
  getPublicUrl,
  generateObjectKey,
  generateContentKey,
  isStorageConfigured,
} from '@/utils/storage'

const uploadImageSchema = z.object({
  base64Data: z.string(), // Base64 encoded image data (without data: prefix)
  filename: z.string(),
  contentType: z.string(),
  prefix: z.string().optional().default('covers'),
})

const uploadContentSchema = z.object({
  content: z.string(), // HTML content
  slug: z.string(), // Article slug for key generation
})

const getContentSchema = z.object({
  key: z.string(), // Object key for content
})

const deleteImageSchema = z.object({
  key: z.string(),
})

const getImageUrlSchema = z.object({
  key: z.string().nullable(),
})

/**
 * Upload an image to RustFS/MinIO storage
 * Returns the object key on success
 */
export const uploadImageFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => uploadImageSchema.parse(data))
  .handler(async ({ data }): Promise<{ key: string } | { error: string }> => {
    if (!isStorageConfigured()) {
      return { error: 'Storage is not configured' }
    }

    try {
      // Decode base64 to buffer
      const buffer = Buffer.from(data.base64Data, 'base64')

      // Generate unique object key
      const key = generateObjectKey(data.filename, data.prefix)

      // Upload to storage
      const result = await uploadFile(buffer, key, data.contentType)

      if (!result) {
        return { error: 'Failed to upload image' }
      }

      return { key: result }
    } catch (error) {
      console.error('[uploadImageFn] Error:', error)
      return { error: 'Upload failed' }
    }
  })

/**
 * Upload article content (HTML) to RustFS/MinIO storage
 * Returns the object key on success
 */
export const uploadContentFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => uploadContentSchema.parse(data))
  .handler(async ({ data }): Promise<{ key: string } | { error: string }> => {
    if (!isStorageConfigured()) {
      return { error: 'Storage is not configured' }
    }

    try {
      // Generate content key based on slug
      const key = generateContentKey(data.slug)

      // Upload content to storage
      const result = await uploadContent(data.content, key)

      if (!result) {
        return { error: 'Failed to upload content' }
      }

      return { key: result }
    } catch (error) {
      console.error('[uploadContentFn] Error:', error)
      return { error: 'Content upload failed' }
    }
  })

/**
 * Get article content from RustFS/MinIO storage
 * Returns the HTML content on success
 */
export const getContentFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => getContentSchema.parse(data))
  .handler(
    async ({ data }): Promise<{ content: string } | { error: string }> => {
      if (!isStorageConfigured()) {
        return { error: 'Storage is not configured' }
      }

      try {
        const content = await getFileContent(data.key)

        if (!content) {
          return { error: 'Content not found' }
        }

        return { content }
      } catch (error) {
        console.error('[getContentFn] Error:', error)
        return { error: 'Failed to fetch content' }
      }
    },
  )

/**
 * Delete an image from RustFS/MinIO storage
 */
export const deleteImageFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => deleteImageSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    if (!isStorageConfigured()) {
      return { success: false, error: 'Storage is not configured' }
    }

    try {
      const success = await deleteFile(data.key)
      return { success }
    } catch (error) {
      console.error('[deleteImageFn] Error:', error)
      return { success: false, error: 'Delete failed' }
    }
  })

/**
 * Get the public URL for an image
 * This is a server function to keep the URL construction logic server-side
 */
export const getImageUrlFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => getImageUrlSchema.parse(data))
  .handler(({ data }): { url: string | null } => {
    const url = getPublicUrl(data.key)
    return { url }
  })

const getFileBase64Schema = z.object({
  key: z.string(),
})

/**
 * Get file from storage as base64 data URL
 * This hides the storage endpoint from the frontend
 */
export const getFileAsBase64Fn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => getFileBase64Schema.parse(data))
  .handler(
    async ({ data }): Promise<{ dataUrl: string } | { error: string }> => {
      if (!isStorageConfigured()) {
        return { error: 'Storage is not configured' }
      }

      try {
        const { getStorageClient } = await import('@/utils/storage')
        const { GetObjectCommand } = await import('@aws-sdk/client-s3')
        const { env } = await import('@/env')

        const client = getStorageClient()
        if (!client) {
          return { error: 'Storage client not available' }
        }

        const response = await client.send(
          new GetObjectCommand({
            Bucket: env.MINIO_BUCKET,
            Key: data.key,
          }),
        )

        if (!response.Body) {
          return { error: 'File not found' }
        }

        // Convert stream to buffer
        const chunks: Buffer[] = []
        for await (const chunk of response.Body as AsyncIterable<Buffer>) {
          chunks.push(chunk)
        }
        const buffer = Buffer.concat(chunks)

        // Return as data URL
        const contentType = response.ContentType || 'application/octet-stream'
        const base64 = buffer.toString('base64')
        const dataUrl = `data:${contentType};base64,${base64}`

        return { dataUrl }
      } catch (error) {
        console.error('[getFileAsBase64Fn] Error:', error)
        return { error: 'Failed to fetch file' }
      }
    },
  )

/**
 * Check if storage is available
 */
export const checkStorageFn = createServerFn({
  method: 'GET',
}).handler((): { configured: boolean } => {
  return { configured: isStorageConfigured() }
})
