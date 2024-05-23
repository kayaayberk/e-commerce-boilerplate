import { storefrontClient } from '@/clients/storeFrontClient'
import { removeOptionsFromUrl } from '@/lib/productOptionsUtils'
import Image from 'next/image'
import { Suspense } from 'react'

export const revalidate = 3600

export const dynamic = 'force-static'

export const dynamicParams = true

interface ProductProps {
  params: { slug: string }
}

export default async function Product({ params: { slug } }: ProductProps) {
  return (
    <Suspense
      fallback={
        //   <PageSkeleton />
        'Loading Page...'
      }
    >
      <ProductView slug={slug} />
    </Suspense>
  )
}

async function ProductView({ slug }: { slug: string }) {
  const product = await storefrontClient.getProduct('8060888088731')
  return (
    <div>

      {product?.handle}
    </div>
  )
}
