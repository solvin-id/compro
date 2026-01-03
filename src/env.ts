import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
    DEV_MODE: z
      .string()
      .default('false')
      .transform((val) => val.toString() === 'true'),
    // RustFS/MinIO S3-compatible storage configuration
    MINIO_ENDPOINT: z.string().url().optional(),
    MINIO_ACCESS_KEY: z.string().optional(),
    MINIO_SECRET_KEY: z.string().optional(),
    MINIO_BUCKET: z.string().default('article-assets'),
    MINIO_PUBLIC_URL: z.string().url().optional(), // Public URL for serving files
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },
  // Use process.env for server-side variables, import.meta.env for client-side
  runtimeEnv: {
    // Server variables from process.env
    SERVER_URL: process.env.SERVER_URL,
    DEV_MODE: process.env.DEV_MODE,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    MINIO_PUBLIC_URL: process.env.MINIO_PUBLIC_URL,
    // Client variables from import.meta.env
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  },
  emptyStringAsUndefined: true,
})
