import { ComparisonOperators, FilterBuilder } from '@/lib/filterBuilderUtils'
import { PlatformCollection } from '@/packages/core/platform/types'
import { SearchParamsType } from '@/types'
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server'
import { ReactNode, Suspense } from 'react'
import { composeFilters } from '../ProductListing/filters'
import { HitsSection } from '../ProductListing/HitsSection'
import { unstable_cache } from 'next/cache'
import { getDemoProducts, isDemoMode } from '@/lib/demoUtils'
import { FacetsDesktop } from '../ProductListing/FacetsDesktop'
import { db } from '@/db'
import { SelectplatformProduct, platformProduct } from '@/db/schema'
import { SearchFacet } from '../ProductListing/SearchFacet'
import { FacetsMobile } from '../ProductListing/FacetsMobile'

interface SearchViewProps {
  searchParams: SearchParamsType
  params?: { slug: string; page?: string }
  collection?: PlatformCollection
  disabledFacets?: string[]
  intro?: ReactNode
}

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  sortBy: parseAsString.withDefault(''),
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  vendors: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  colors: parseAsArrayOf(parseAsString).withDefault([]),
  sizes: parseAsArrayOf(parseAsString).withDefault([]),
})

export async function SearchView({
  searchParams,
  disabledFacets,
  intro,
  collection,
}: SearchViewProps) {
  const { q, sortBy, page, ...rest } = searchParamsCache.parse(searchParams)

  const filterBuilder = new FilterBuilder()

  if (collection) {
    filterBuilder.where('collections.title', ComparisonOperators.Equal, collection.title)
  }

  const { facetDistribution, hits, totalPages } = await searchProducts(
    q,
    sortBy,
    page,
    composeFilters(filterBuilder, rest).build()
  )

  // const facets: SelectplatformProduct[] = await db.select().from(platformProduct)
  // console.log(facets.map(facet => facet.))

  return (
    <div className='mx-auto w-full max-w-container-md px-4 py-12 md:py-24 xl:px-0'>
      {intro}
      <div className='flex min-h-screen w-full flex-col gap-12 md:flex-row md:gap-24'>
        <div className='flex w-full flex-col'>
          <div className='flex w-full flex-wrap items-start justify-between'>
            <div className='flex flex-col'>
              <div className='flex w-full gap-10 pb-8'>
                <div className='flex items-center justify-between gap-4'>
                  <FacetsMobile
                    disabledFacets={disabledFacets}
                    facetDistribution={facetDistribution}
                    className='block md:hidden'
                  />
                </div>
                <Suspense>
                  <SearchFacet className='grow' />
                </Suspense>
                {/*  has to be wrapped w. suspense, nuqs is using useSearchParams in useQueryState
                 * https://github.com/47ng/nuqs/issues/496
                 */}
                <Suspense>
                  {/* <Sorter className="ml-auto hidden shrink-0 basis-[200px] self-center lg:block" /> */}
                </Suspense>
              </div>
              <FacetsDesktop
                disabledFacets={disabledFacets}
                className='hidden min-w-[250px] max-w-[250px] md:mt-16 lg:block'
                facetDistribution={facetDistribution}
              />
            </div>

            <HitsSection hits={hits} />
            {/* <PaginationSection queryParams={searchParams} totalPages={totalPages} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

const searchProducts = unstable_cache(
  async (query: string, sortBy: string, page: number, filter: string) => {
    'use server'
    if (isDemoMode()) return getDemoProducts()

    const facets = await db.query.platformProduct.findMany({
      columns: {
        collections: true,
      },
    })
    console.log(facets)

    // const index = await meilisearch?.getIndex<PlatformProduct>(MEILISEARCH_INDEX)

    // const results = await index?.search(query, {
    //   sort: sortBy ? [sortBy] : undefined,
    //   hitsPerPage: 24,
    //   facets: ["collections.title", "tags", "vendor", "variants.availableForSale", "flatOptions.Size", "flatOptions.Color", "minPrice"],
    //   filter,
    //   page,
    //   attributesToRetrieve: ["id", "handle", "title", "priceRange", "featuredImage", "minPrice", "variants", "images"],
    // })

    // const hits = results?.hits || []
    // const totalPages = results?.totalPages || 0
    // const facetDistribution = results?.facetDistribution || {}
    // const totalHits = results.totalHits

    // return { hits, totalPages, facetDistribution, totalHits }
  },
  ['products-search'],
  { revalidate: 3600 }
)
