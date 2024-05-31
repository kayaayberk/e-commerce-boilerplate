import type { PlatformCollection, PlatformProduct } from '@/packages/core/platform/types'
import { getDemoCategories, getDemoProducts, isDemoMode } from '@/lib/demoUtils'
import { storefrontClient } from '@/clients/storeFrontClient'
import { platformProduct } from '@/db/schema'
import { MetadataRoute } from 'next'
import { env } from '@/env'
import { db } from '@/db'

export const revalidate = 604800
export const runtime = 'nodejs'

const BASE_URL = env.LIVE_URL
const HITS_PER_PAGE = 24

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(new Date().setHours(0, 0, 0, 0)),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(new Date().setHours(0, 0, 0, 0)),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: new Date(),
      priority: 0.1,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      priority: 0.1,
    },
  ]

  let allHits: PlatformProduct[] = []
  let allCollections: PlatformCollection[] = []
  let finished = false
  let page = 0

  if (!isDemoMode()) {
    while (finished === false) {
      const response = await db
        .select()
        .from(platformProduct)
        .limit(100)
        .offset(page * 100)

      allHits.push(...response.map((results) => results))
      page++

      if (allHits.length >= response.length) {
        finished = true
      }
    }

    const collections = await storefrontClient.getCollections()
    allCollections = collections || []
  } else {
    allHits = getDemoProducts().hits
    allCollections = getDemoCategories()
  }

  const paginationRoutes = Array.from({ length: allHits.length / HITS_PER_PAGE }, (_, i) => {
    const item: MetadataRoute.Sitemap[0] = {
      url: `${BASE_URL}/search?page=${i + 1}`,
      priority: 0.5,
      changeFrequency: 'monthly',
    }
    return item
  })

  const productRoutes = allHits.map((hit) => {
    const item: MetadataRoute.Sitemap[0] = {
      url: `${BASE_URL}/products/${hit.handle}`,
      lastModified: hit.updatedAt,
      priority: 0.5,
      changeFrequency: 'monthly',
    }
    return item
  })

  const collectionsRoutes = allCollections.map((collection) => {
    const item: MetadataRoute.Sitemap[0] = {
      url: `${BASE_URL}/category/${collection.handle}`,
      lastModified: collection.updatedAt,
      priority: 0.5,
      changeFrequency: 'monthly',
    }
    return item
  })

  return [...staticRoutes, ...paginationRoutes, ...productRoutes, ...collectionsRoutes]
}
