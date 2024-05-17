import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  skipValidation:
    process.env.NODE_ENV !== 'production' || process.env.SKIP_ENV_VALIDATION === 'true',
  server: {
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string(),
    SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
    SHOPIFY_APP_API_SECRET_KEY: z.string().optional(),
    SHOPIFY_STORE_DOMAIN: z.string(),
    DATABASE_URL: z.string(),
    LIVE_HEADLESS_URL: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    SHOPIFY_APP_API_SECRET_KEY: process.env.SHOPIFY_APP_API_SECRET_KEY,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    LIVE_HEADLESS_URL: process.env.LIVE_HEADLESS_URL || '',
  },
})
