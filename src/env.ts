import { config } from 'dotenv'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

// Server-only module: load `.env` before `createEnv` snapshots `process.env`.
// Without this, import order decides whether BACKEND_ENABLED/DATABASE_URL are visible.
config()

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
    // Master switch: true = Postgres/storage, false = constant fixtures.
    BACKEND_ENABLED: z
      .string()
      .default('true')
      .transform((val) => val.toString() !== 'false'),
    // RustFS/MinIO S3-compatible storage configuration
    MINIO_ENDPOINT: z.string().url().optional(),
    MINIO_ACCESS_KEY: z.string().optional(),
    MINIO_SECRET_KEY: z.string().optional(),
    MINIO_BUCKET: z.string().default('article-assets'),
    MINIO_PUBLIC_URL: z.string().url().optional(), // Public URL for serving files

    // SMTP Configuration
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional(),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },
  // Use process.env for server-side variables, import.meta.env for client-side
  runtimeEnv: {
    // Server variables from process.env
    SERVER_URL: process.env.SERVER_URL,
    BACKEND_ENABLED: process.env.BACKEND_ENABLED,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    MINIO_PUBLIC_URL: process.env.MINIO_PUBLIC_URL,
    // SMTP
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    // Client variables from import.meta.env
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  },
  emptyStringAsUndefined: true,
})
