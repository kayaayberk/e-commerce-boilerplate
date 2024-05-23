import type { Config } from 'drizzle-kit'

export default {
  dialect: 'postgresql',
  schema: './db/schema.ts',
  dbCredentials: {
    url: process.env.POSTGRES_URL! as string,
  },
  verbose: true,
  strict: true,
} satisfies Config
