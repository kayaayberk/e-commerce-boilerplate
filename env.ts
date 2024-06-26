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
    POSTGRES_URL: z.string(),
    LIVE_URL: z.string().optional(),
    // GTM_ID: z.string().optional().default(),
    IS_GTM_ENABLED: z.enum(['true', 'false']).optional(),
    IS_SPEED_INSIGHTS_ENABLED: z.enum(['true', 'false']).optional(),
    IS_VERCEL_ANALYTICS_ENABLED: z.enum(['true', 'false']).optional(),
    IS_DEMO_MODE: z.enum(['true', 'false']).optional(),
  },
  client: {},
  runtimeEnv: {
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    SHOPIFY_APP_API_SECRET_KEY: process.env.SHOPIFY_APP_API_SECRET_KEY,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    POSTGRES_URL: process.env.POSTGRES_URL,
    LIVE_URL: process.env.LIVE_URL || '',
    IS_GTM_ENABLED: process.env.IS_GTM_ENABLED,
    IS_VERCEL_ANALYTICS_ENABLED: process.env.IS_VERCEL_ANALYTICS_ENABLED || 'true',
    IS_SPEED_INSIGHTS_ENABLED: process.env.IS_SPEED_INSIGHTS_ENABLED || 'true',
    // GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    IS_DEMO_MODE: process.env.NEXT_PUBLIC_IS_DEMO_MODE,
  },
})
