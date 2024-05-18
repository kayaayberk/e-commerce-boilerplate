import { storefrontClient } from '@/clients/storeFrontClient'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'

export default async function CategoriesSection() {
  const categories = await getCategories()
  console.log(categories)

  return (
    <div className='mx-auto flex w-full flex-col gap-16 px-4 py-20 md:py-32'>
      <div className='basis-1/3 text-center text-5xl font-normal tracking-tighter sm:min-w-[280px] md:text-left md:text-6xl'>
        <h2>Shop by Category</h2>
      </div>

      <div className='flex gap-10'>
        {categories.map((singleCategory, index) => (
          <Link
            key={singleCategory.handle + index}
            href={`/category/${singleCategory.handle}`}
            className='text-lg font-normal'
          >
            <div className='relative w-20 overflow-hidden rounded-lg object-cover'>
              <Image
                src={singleCategory.image?.url || ''}
                alt={singleCategory.image?.altText || ''}
                priority
                width={300}
                height={300}
                objectFit='cover'
                className='w-40'
                // sizes='(max-width: 450px) 150px, 300px'
              />
            </div>
            {singleCategory.title}
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
