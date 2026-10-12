import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  casing: 'camelCase',
  dialect: 'sqlite',
})
