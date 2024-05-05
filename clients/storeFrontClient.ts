import 'server-only'

import { createStorefrontClient } from '@/packages/core/platform'
import { env } from '@/env'

export const storefrontClient = createStorefrontClient({
  strategy: 'shopify',
  storeDomain: env.SHOPIFY_STORE_DOMAIN || '',
  storefrontAccessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  adminAccessToken: env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
})
