import { PlatformCollection, PlatformVariant } from '@/packages/core/platform/types'
import { CategoriesDistribution } from '@/views/ProductListing/FacetsDesktop'

interface Item {
  [key: string]: any
  collections: Pick<PlatformCollection, "handle" | "id" | "title">[]
  tags: string[]
  vendor: string
  variants: PlatformVariant[]
  flatOptions: Record<string, string[]>
  minPrice: number
}

export function convertToFacetStructure(data: Item[]) {
  const facetDistribution: Record<string, CategoriesDistribution> | undefined = {}

  data.forEach((item) => {
    // Handle "collections.title"
    if (!facetDistribution['collections.title']) {
      facetDistribution['collections.title'] = {}
    }
    item.collections.forEach((collection) => {
      const title = collection.title
      if (!facetDistribution['collections.title'][title]) {
        facetDistribution['collections.title'][title] = 0
      }
      facetDistribution['collections.title'][title]++
    })

    // Handle "tags"
    if (!facetDistribution['tags']) {
      facetDistribution['tags'] = {}
    }
    item.tags.forEach((tag) => {
      if (!facetDistribution['tags'][tag]) {
        facetDistribution['tags'][tag] = 0
      }
      facetDistribution['tags'][tag]++
    })

    // Handle "vendor"
    if (!facetDistribution['vendor']) {
      facetDistribution['vendor'] = {}
    }
    const vendor = item.vendor
    if (!facetDistribution['vendor'][vendor]) {
      facetDistribution['vendor'][vendor] = 0
    }
    facetDistribution['vendor'][vendor]++

    // Handle "variants.availableForSale"
    if (!facetDistribution['variants.availableForSale']) {
      facetDistribution['variants.availableForSale'] = { true: 0, false: 0 }
    }
    const availableForSale = item?.availableForSale?.some(
      (variant: PlatformVariant) => variant.availableForSale
    )
    facetDistribution['variants.availableForSale'][availableForSale ? 'true' : 'false']++

    // Handle "flatOptions.Size"
    if (!facetDistribution['flatOptions.Size']) {
      facetDistribution['flatOptions.Size'] = {}
    }

    item.flatOptions?.Size?.forEach((value: string | number) => {
      if (!facetDistribution['flatOptions.Size'][value]) {
        facetDistribution['flatOptions.Size'][value] = 0
      }
      facetDistribution['flatOptions.Size'][value]++
    })

    // Handle "flatOptions.Color"
    if (!facetDistribution['flatOptions.Color']) {
      facetDistribution['flatOptions.Color'] = {}
    }

    item.flatOptions?.Color?.forEach((value: string | number) => {
      if (!facetDistribution['flatOptions.Color'][value]) {
        facetDistribution['flatOptions.Color'][value] = 0
      }
      facetDistribution['flatOptions.Color'][value]++
    })

    // Handle "minPrice"
    if (!facetDistribution['minPrice']) {
      facetDistribution['minPrice'] = {}
    }
    const minPrice = item.minPrice
    if (!facetDistribution['minPrice'][minPrice]) {
      facetDistribution['minPrice'][minPrice] = 0
    }
    facetDistribution['minPrice'][minPrice]++
  })

  return facetDistribution
}
