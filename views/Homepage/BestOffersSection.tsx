import { getProductRecommendations } from '@/app/actions/product.actions'
import { CarouselSection } from './CarouselSection'
import { unstable_cache } from 'next/cache'

export async function BestOffersSection() {
  const items = await getBestOffers()

  return <CarouselSection title='Best Offers' items={items} />
}

const getBestOffers = unstable_cache(
  async () => {
    // Product id to get recommendations is hard-coded for now but you can dynamically fetch products based on your needs
    const results = await getProductRecommendations('8107033886875')

    return results || []
  },
  ['relevant-products'],
  { revalidate: 3600 }
)
