import { PageSkeleton } from '@/views/Category/PageSkeleton'
import { SearchView } from '@/views/Search/SearchView'
import { SearchParamsType } from '@/types'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Search | Enterprise Commerce',
  description: 'In excepteur elit mollit in.',
}

export const runtime = 'nodejs'

export const revalidate = 3600

interface SearchPageProps {
  searchParams: SearchParamsType
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SearchView searchParams={searchParams} />
    </Suspense>
  )
}
