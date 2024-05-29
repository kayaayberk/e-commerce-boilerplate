'use server'

import { convertToFacetStructure } from '@/lib/structureConverterUtils'
import { SelectplatformProduct, platformProduct } from '@/db/schema'
import { storefrontClient } from '@/clients/storeFrontClient'
import { parseFilter } from '@/lib/filterParserUtils'
import { asc, desc, eq, lte } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { db } from '@/db'
import { PlatformProduct } from '@/packages/core/platform/types'

export const searchProducts = unstable_cache(
  async (query: string, sortBy: string, page: number, filter: string) => {

    // Parse string filter designed for Meilisearch into an object to be used in Drizzle select
    const filteredProducts = parseFilter(filter)

    // Check if there is no filter other than the collection name
    const isEmptyFacet = 
         filteredProducts.minPrice === null 
      && filteredProducts.maxPrice === null
      && filteredProducts.tags.length === 0 
      && filteredProducts.sizes.length === 0 
      && filteredProducts.vendor.length === 0 
      && filteredProducts.colors.length === 0 


    // Sort by <Sorter /> conditions
    const hitsSelect: SelectplatformProduct[] = 
        sortBy === 'minPrice:desc' ? (
      await db.select().from(platformProduct).orderBy(desc(platformProduct.minPrice))
    ) : sortBy === 'minPrice:asc' ? (
      await db.select().from(platformProduct).orderBy(asc(platformProduct.minPrice))
    ) : sortBy === 'updatedAtTimestamp:asc' ? (
      await db.select().from(platformProduct).orderBy(asc(platformProduct.updatedAtTimestamp))
    ) : sortBy === 'updatedAtTimestamp:desc' ? (
      await db.select().from(platformProduct).orderBy(desc(platformProduct.minPrice))
    ) : sortBy === '' ? (
      await db.select().from(platformProduct)
    ) : []

    // Only filter by collection if there is no filter
    const filterByCollection = hitsSelect.filter((product) => product.collections.find((collection) => collection.title === filteredProducts.categories))

    // Filter by facets
    const filterByFacets = filterByCollection.filter((product) => {
      const { minPrice, maxPrice, vendor, tags, colors, sizes } = filteredProducts
      const { minPrice: productMinPrice, vendor: productVendor, tags: productTags, flatOptions: productFlatOptions } = product

      const colorsFilter = colors && productFlatOptions?.Color ? productFlatOptions.Color.some(color => colors.includes(color)) : false
      const sizesFilter = sizes && productFlatOptions?.Size ? productFlatOptions.Size.some(size => sizes.includes(size)) : false
      const tagsFilter = tags && productTags ? productTags.some(tag => tags.includes(tag)) : false
      const maxPriceFilter = maxPrice && productMinPrice ? productMinPrice <= maxPrice : false
      const vendorFilter = vendor && productVendor ? vendor.includes(productVendor) : false
      const priceFilter = minPrice && productMinPrice ? productMinPrice >= minPrice : false

      return priceFilter || maxPriceFilter || vendorFilter || tagsFilter || colorsFilter || sizesFilter
    })

    // Attributes to return from hit products
    const facets = filterByCollection.map(({ collections, tags, vendor, variants, flatOptions, minPrice }) => ({ collections, tags, vendor, variants, flatOptions, minPrice }))

    // Convert facets to a structure that can be used in the frontend
    const convertedFacet = convertToFacetStructure(facets) || {}

    // Return conditions
    const allHits = !isEmptyFacet ? filterByFacets || [] : filterByCollection || []
    const hits = allHits.slice((page - 1) * 9, page * 9) as PlatformProduct[]
    const totalPages = !isEmptyFacet ? Math.ceil((filterByFacets.length / 9)) : Math.ceil((filterByCollection.length / 9)) || 0
    const facetDistribution = convertedFacet
    const totalHits = isEmptyFacet ? hitsSelect.length : filterByFacets.length

    return {
      hits,
      totalPages,
      facetDistribution,
      totalHits
    }
  },
  ['products-search'],
  { revalidate: 3600 }
)

export const getProductsUnderCertainPrice = unstable_cache(
  async (price: number, limit: number = 8) => {
    // if (isDemoMode()) return getDemoProducts().hits.slice(0, 8)

    const results: SelectplatformProduct[] = await db.select().from(platformProduct).where(lte(platformProduct.minPrice, price)).limit(limit)

    return results as PlatformProduct[] || []
  },
  ['relevant-products'],
  { revalidate: 3600 }
)

export const getProduct = unstable_cache(
  async (handle: string) => {
    const product: SelectplatformProduct[] = await db.select().from(platformProduct).where(eq(platformProduct.handle, handle))

    return product.find(Boolean) || null
  },
  ["product-by-handle"],
  { revalidate: 3600 }
)


export const searchProduct = unstable_cache(
  async (query: string, limit: number = 4) => {
    const reponse = await storefrontClient.searchProducts(query, limit)

    return reponse
})


export const getProductRecommendations = unstable_cache(
  async (id: string) => {
    const response = await storefrontClient.getProductRecommendations(id)

    return response || []
  },
  ['product-recommendations'],
  { revalidate: 3600 }
)

interface SearchProductsResult {
  hits: SelectplatformProduct[];
  hasMore: boolean;
}

export const searchProductsAuto = unstable_cache(
  async (query: string, limit: number = 4): Promise<SearchProductsResult> => {
    const hitsSelect: SelectplatformProduct[] = await db.select().from(platformProduct)

    const hasMore = hitsSelect?.length > limit

    return { hits: hitsSelect, hasMore }
  },
  ['autocomplete-search'],
  { revalidate: 3600 }
)

export const predictiveSearch = unstable_cache(async (query: string, first: number, limitScope: 'EACH' | 'ALL') => {
  const response = await storefrontClient.getPredictiveSearchResults(query, first, limitScope)
  // const compareHasMore = (await storefrontClient.getPredictiveSearchResults(query, first, 'EACH')).products?.length

  // const { collections, querySuggestion, pages } = response

  // if (!response.products) return { hits: [] }
  // if (!compareHasMore) return { hasMore: false }

  // const hits = response.products.map(({id, title, handle, featuredImage, images, variants}) => ({id, title, handle, featuredImage, images, variants}))

  // const hasMore = hits?.length > compareHasMore



  return response
},
['autocomplete-search'],
{ revalidate: 3600 }
)