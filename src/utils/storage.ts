import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { env } from '@/env'

let s3Client: S3Client | null = null

/**
 * Get or create S3 client for RustFS/MinIO
 */
export function getStorageClient(): S3Client | null {
  if (!env.MINIO_ENDPOINT || !env.MINIO_ACCESS_KEY || !env.MINIO_SECRET_KEY) {
    console.warn('[Storage] Missing RustFS/MinIO configuration')
    return null
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: 'us-east-1', // Required but not used by RustFS/MinIO
      credentials: {
        accessKeyId: env.MINIO_ACCESS_KEY,
        secretAccessKey: env.MINIO_SECRET_KEY,
      },
      endpoint: env.MINIO_ENDPOINT,
      forcePathStyle: true, // Required for MinIO/RustFS compatibility
    })
  }

  return s3Client
}

/**
 * Upload a file to RustFS/MinIO storage
 * @param buffer - File buffer to upload
 * @param key - Object key (path in bucket)
 * @param contentType - MIME type of the file
 * @returns Object key on success, null on failure
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string | null> {
  const client = getStorageClient()
  if (!client) {
    return null
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: env.MINIO_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    )

    return key
  } catch (error) {
    console.error('[Storage] Upload failed:', error)
    return null
  }
}

/**
 * Upload text content (HTML) to RustFS/MinIO storage
 * @param content - Text content to upload
 * @param key - Object key (path in bucket)
 * @returns Object key on success, null on failure
 */
export async function uploadContent(
  content: string,
  key: string,
): Promise<string | null> {
  const buffer = Buffer.from(content, 'utf-8')
  return uploadFile(buffer, key, 'text/html; charset=utf-8')
}

/**
 * Get file content from RustFS/MinIO storage
 * @param key - Object key to fetch
 * @returns File content as string, null on failure
 */
export async function getFileContent(key: string): Promise<string | null> {
  const client = getStorageClient()
  if (!client) {
    return null
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: env.MINIO_BUCKET,
        Key: key,
      }),
    )

    if (response.Body) {
      const chunks: Buffer[] = []
      for await (const chunk of response.Body as AsyncIterable<Buffer>) {
        chunks.push(chunk)
      }
      return Buffer.concat(chunks).toString('utf-8')
    }

    return null
  } catch (error) {
    console.error('[Storage] Get content failed:', error)
    return null
  }
}

/**
 * Delete a file from RustFS/MinIO storage
 * @param key - Object key to delete
 * @returns true on success, false on failure
 */
export async function deleteFile(key: string): Promise<boolean> {
  const client = getStorageClient()
  if (!client) {
    return false
  }

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.MINIO_BUCKET,
        Key: key,
      }),
    )
    return true
  } catch (error) {
    console.error('[Storage] Delete failed:', error)
    return false
  }
}

/**
 * Get the public URL for an object
 * @param key - Object key
 * @returns Full public URL to the object
 */
export function getPublicUrl(key: string | null): string | null {
  if (!key) return null

  // Use MINIO_PUBLIC_URL if set, otherwise fall back to endpoint
  const baseUrl = env.MINIO_PUBLIC_URL || env.MINIO_ENDPOINT
  if (!baseUrl) return null

  // Remove trailing slash from base URL
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')

  return `${cleanBaseUrl}/${env.MINIO_BUCKET}/${key}`
}

/**
 * Generate a unique object key for a file
 * @param filename - Original filename
 * @param prefix - Folder prefix (e.g., 'covers')
 * @returns Unique object key
 */
export function generateObjectKey(filename: string, prefix = 'covers'): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = filename
    .replace(/\.[^.]+$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace special chars with dash
    .substring(0, 30) // Limit length

  return `${prefix}/${timestamp}-${safeName}-${randomSuffix}.${extension}`
}

/**
 * Generate a unique object key for article content
 * @param slug - Article slug
 * @returns Unique object key for content
 */
export function generateContentKey(slug: string): string {
  const timestamp = Date.now()
  return `content/${slug}-${timestamp}.html`
}

/**
 * Check if storage is properly configured
 */
export function isStorageConfigured(): boolean {
  return !!(env.MINIO_ENDPOINT && env.MINIO_ACCESS_KEY && env.MINIO_SECRET_KEY)
}
