import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { PlatformProduct } from '@/packages/core/platform/types'
import { ProductCard } from 'components/ProductCard/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

interface CarouselSectionProps {
  title: string
  items: PlatformProduct[]
}

export function CarouselSection({ items, title }: CarouselSectionProps) {
  return (
    <Carousel opts={{ skipSnaps: true }}>
      <div className='mx-auto flex max-w-container-md flex-col gap-16 px-4 py-20 md:pb-32 md:pt-24 xl:px-0'>
        <div className='flex justify-between text-left text-4xl font-normal tracking-tighter sm:min-w-[280px] md:text-left md:text-5xl'>
          <h3>{title}</h3>
          <div className='hidden md:flex'>
            <CarouselPrevious className='relative translate-x-5' />
            <CarouselNext className='relative -translate-x-12' />
          </div>
        </div>
        <div className='w-full'>
          <CarouselContent className='ml-0 justify-start gap-8'>
            {items.map((product, idx) => (
              <ProductCard
                className='h-full min-w-[200px] max-w-[200px] md:min-w-[280px] md:max-w-[280px]'
                {...product}
                key={'relevant_' + product.id + idx}
              />
            ))}
          </CarouselContent>
        </div>
      </div>
    </Carousel>
  )
}

export function CarouselSectionSkeleton() {
  return (
    <div className='mx-auto flex max-w-container-md flex-col gap-16 px-4 py-20 md:pb-32 md:pt-24 xl:px-0'>
      <div className='basis-1/3 text-center text-5xl font-normal tracking-tighter sm:min-w-[280px] md:text-left md:text-6xl'>
        <Skeleton className='h-[60px] w-[280px]' />
      </div>
      <div className='w-full'>
        <Carousel opts={{ containScroll: 'keepSnaps', dragFree: true }}>
          <CarouselContent className='ml-0 justify-start gap-8'>
            {Array.from({ length: 8 }, (_, idx) => (
              <Skeleton className='h-[430px] min-w-[280px] max-w-[280px]' key={idx} />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
