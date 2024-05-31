import { PlatformProduct } from '@/packages/core/platform/types'

export type SearchParamsType = Record<string, string | string[] | undefined>

export type CommerceProduct = PlatformProduct & {
  avgRating: number
  totalReviews: number
  reviewsSummary: string
}
