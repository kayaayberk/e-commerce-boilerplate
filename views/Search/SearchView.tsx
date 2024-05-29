import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server'
import { ComparisonOperators, FilterBuilder } from '@/lib/filterBuilderUtils'
import { PaginationSection } from '../ProductListing/PaginationSection'
import { PlatformCollection } from '@/packages/core/platform/types'
import { FacetsDesktop } from '../ProductListing/FacetsDesktop'
import { searchProducts } from '@/app/actions/product.actions'
import { FacetsMobile } from '../ProductListing/FacetsMobile'
import { SearchFacet } from '../ProductListing/SearchFacet'
import { HitsSection } from '../ProductListing/HitsSection'
import { composeFilters } from '../ProductListing/filters'
import { Sorter } from '../ProductListing/Sorter'
import { ReactNode, Suspense } from 'react'
import { SearchParamsType } from '@/types'

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

// prettier-ignore
export async function SearchView({ searchParams, disabledFacets, intro, collection }: SearchViewProps) {
  const { q, sortBy, page, ...rest } = searchParamsCache.parse(searchParams)

  const filterBuilder = new FilterBuilder()

  if (collection) {
    filterBuilder.where('collections.title', ComparisonOperators.Equal, collection.title)
  }

  const { facetDistribution, hits, totalPages } = await searchProducts( q, sortBy, page, composeFilters(filterBuilder, rest).build() )

  return (
    <div className='mx-auto w-full max-w-container-md px-4 py-12 md:py-24 xl:px-0'>
      {intro}
      <div className='flex min-h-screen w-full flex-col gap-12 md:flex-row md:gap-24'>
        <div className='flex flex-col items-start justify-start md:pt-16 '>
          <Suspense>
            <SearchFacet />
          </Suspense>
          <FacetsDesktop
            disabledFacets={disabledFacets}
            className='hidden min-w-[250px] max-w-[250px] lg:block'
            facetDistribution={facetDistribution}
          />
        </div>
        <div className='flex w-full flex-col'>
          <div className='mb-6 flex w-full flex-wrap items-center justify-between'>
            <div className='flex w-full gap-2 pb-8'>
              <div className='flex items-center justify-between gap-4'>
                <FacetsMobile
                  disabledFacets={disabledFacets}
                  facetDistribution={facetDistribution}
                  className='block md:hidden'
                />
              </div>

              {/*  has to be wrapped w. suspense, nuqs is using useSearchParams in useQueryState
               * https://github.com/47ng/nuqs/issues/496
               */}
              <Suspense>
                <Sorter className='ml-auto hidden shrink-0 basis-[200px] self-center lg:block' />
              </Suspense>
            </div>

            <HitsSection hits={hits} />
            <PaginationSection queryParams={searchParams} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  )
}
