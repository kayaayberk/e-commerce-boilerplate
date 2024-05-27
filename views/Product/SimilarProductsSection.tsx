import { getProductRecommendations } from '@/app/actions/product.actions'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ProductCard } from 'components/ProductCard/ProductCard'

interface SimilarProductsSectionProps {
  id: string
}

export async function SimilarProductsSection({ id }: SimilarProductsSectionProps) {
  if (!id) return null
  const items = await getProductRecommendations(id)

  return (
    <section className='py-40'>
      <h2 className='mb-10 text-[26px] font-normal tracking-[-0.78px]'>You might also like</h2>
      <Carousel opts={{ skipSnaps: true }}>
        <CarouselContent className='ml-0 justify-start gap-6'>
          {items?.map((product, idx) => (
            <ProductCard
              className='h-full min-w-[150px] max-w-[150px] md:min-w-[280px] md:max-w-[280px]'
              key={'featured_' + product.id + idx}
              {...product}
            />
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </section>
  )
}
