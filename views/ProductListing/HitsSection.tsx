import { ProductCard } from '@/components/ProductCard/ProductCard'
import { PlatformProduct } from '@/packages/core/platform/types'

interface HitsSectionProps {
  hits: PlatformProduct[]
}

export async function HitsSection({ hits }: HitsSectionProps) {
  if (!hits.length) {
    return <p>No results for this query</p>
  }
  return (
    <div className='grid grid-cols-3 items-start gap-4'>
      {hits.map((singleResult, idx) => (
        <ProductCard
          className='overflow-hidden rounded-lg'
          key={singleResult.id}
          priority={[0, 1].includes(idx)}
          {...singleResult}
        />
      ))}
    </div>
  )
}
