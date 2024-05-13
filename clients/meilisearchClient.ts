import { MEILISEARCH_INDEX } from '@/constants'
import { env } from '@/env'
import { PlatformProduct } from '@/packages/core/platform/types'
import { EnqueuedTask, MeiliSearch } from 'meilisearch'

const meilisearchClientSingleton = () => {
  return new MeiliSearch({
    host: env.MEILISEARCH_HOST || '',
    apiKey: env.MEILISEARCH_MASTER_KEY || '',
  })
}

declare global {
  var meilisearch: undefined | ReturnType<typeof meilisearchClientSingleton>
}

const meilisearch = globalThis.meilisearch ?? meilisearchClientSingleton()

//prettier-ignore
let searchableAttributes: Promise<EnqueuedTask> | undefined
let filterableAttributes: Promise<EnqueuedTask> | undefined
let sortableAttributes: Promise<EnqueuedTask> | undefined
let rankingRules: Promise<EnqueuedTask> | undefined
//prettier-ignore
;( () => {
  const index = meilisearch.index<PlatformProduct>(MEILISEARCH_INDEX)
  searchableAttributes = index?.updateSearchableAttributes(['*'])
  filterableAttributes = index?.updateFilterableAttributes(['collections', 'collections.title', 'flatOptions', 'handle', 'minPrice', 'tags', 'variants.availableForSale', 'vendor',])
  sortableAttributes = index?.updateSortableAttributes(["minPrice","updatedAtTimestamp"])
  rankingRules = index?.updateRankingRules(["sort","words","typo","proximity","attribute","exactness"])
})()

export { meilisearch }

if (process.env.NODE_ENV !== 'production') globalThis.meilisearch = meilisearch
