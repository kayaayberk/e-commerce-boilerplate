import { storefrontClient } from '@/clients/storeFrontClient'
import { SearchView } from '../Search/SearchView'
import { SearchParamsType } from '@/types'
import { notFound } from 'next/navigation'
import { HeroSection } from './Hero'

interface CategoryViewProps {
  params: { slug: string; page?: string }
  searchParams?: SearchParamsType
}

export async function CategoryView({ params, searchParams = {} }: CategoryViewProps) {
  const collection = await storefrontClient.getCollection(params.slug)


  if (!collection) return notFound()

  return (
    <SearchView
      searchParams={searchParams}
      params={params}
      disabledFacets={['category', 'tags']}
      collection={collection}
      intro={
        <HeroSection
          handle={collection.handle}
          title={collection.title}
          description={collection.description}
          image={collection.image}
        />
      }
    />
  )
}
