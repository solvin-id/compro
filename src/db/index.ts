import { config } from 'dotenv'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema.ts'

config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  // A dead or unreachable database must fail the request, never hang it.
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
})
export const db = drizzle(pool, { schema })
