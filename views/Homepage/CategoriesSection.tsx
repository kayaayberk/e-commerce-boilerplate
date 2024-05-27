/* eslint-disable @next/next/no-img-element */
import { storefrontClient } from '@/clients/storeFrontClient'
import { Skeleton } from '@/components/ui/skeleton'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'

export default async function CategoriesSection() {
  const categories = await getCategories()

  return (
    <div className='mx-auto flex w-full max-w-container-md flex-col gap-16 px-4 py-20 md:py-32 xl:px-0'>
      <div className='basis-1/3 text-center text-5xl font-normal tracking-tighter sm:min-w-[280px] md:text-left md:text-6xl'>
        <h2>Shop by Category</h2>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {categories.map((singleCategory, index) => (
          <Link
            key={singleCategory.handle + index}
            href={`/category/${singleCategory.handle}`}
            className='group bg-white hover:shadow-md transition-shadow duration-200 hover:shadow-black/40 rounded-2xl'
          >
            <div className='relative h-[260px] w-full overflow-hidden rounded-2xl border border-black/80 bg-neutral-500'>
              <div className='absolute bg-gradient-to-b from-[#090909] to-neutral-800 inset-0 size-full rounded-2xl mt-[0.13rem] border-t border-t-neutral-500/50'>
              </div>
              <h3 className='absolute bottom-8 left-8 text-3xl text-white group-hover:scale-105 transition-transform duration-200'>
                {singleCategory.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const getCategories = unstable_cache(
  async () => {
    // if (isDemoMode()) return getDemoCategories().slice(0, 6)

    const results = await storefrontClient.getCollections(6)
    return results || []
  },
  ['categories-section'],
  { revalidate: 3600 }
)

export function CategoriesSectionSkeleton() {
  return (
    <div className='mx-auto flex max-w-container-md flex-col gap-16 px-4 py-20 md:py-32 xl:px-0'>
      <div className='basis-1/3 text-center text-5xl font-normal tracking-tighter sm:min-w-[280px] md:text-left md:text-6xl'>
        <h2>Shop by Category</h2>
      </div>
      <div className='group mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className='relative h-[260px] w-full overflow-hidden rounded-2xl' />
        ))}
      </div>
    </div>
  )
}
