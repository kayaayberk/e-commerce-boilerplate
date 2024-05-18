import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

import { env } from '@/env'
import postgres from 'postgres'

const connectionString = env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema, logger: true })
