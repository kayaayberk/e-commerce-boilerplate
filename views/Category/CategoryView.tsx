import { getCollections, getSingleCollection } from '@/app/actions/collection.actions'
import { SearchView } from '../Search/SearchView'
import { SearchParamsType } from '@/types'
import { notFound } from 'next/navigation'
import { HeroSection } from './Hero'

interface CategoryViewProps {
  params: { slug: string; page?: string }
  searchParams?: SearchParamsType
}

export async function CategoryView({ params, searchParams = {} }: CategoryViewProps) {
  const collection = await getSingleCollection(params.slug)
  const collections = await getCollections()

  if (!collection) return notFound()

  return (
    <SearchView
      searchParams={searchParams}
      params={params}
      disabledFacets={[
        // 'tags',
        'category' 
      ]}
      collection={collection}
      intro={
        <HeroSection
          handle={collection.handle}
          title={collection.title}
          description={collection.description}
          image={collection.image}
          collections={collections}
        />
      }
    />
  )
}
