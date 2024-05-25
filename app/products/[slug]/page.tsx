import {
  getCombination,
  getOptionsFromUrl,
  hasValidOption,
  removeOptionsFromUrl,
} from '@/lib/productOptionsUtils'
import { SimilarProductsSectionSkeleton } from '@/views/ProductListing/Product/SimilarProductsSectionSkeleton'
import { PageSkeleton } from '@/views/ProductListing/Product/PageSkeleton'
import { PlatformProduct } from '@/packages/core/platform/types'
import { getProduct } from '@/app/actions/product.actions'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { generateJsonLd } from './metadata'
import { GoBack } from '@/views/Product/GoBack'
import ImageCarousel from '@/views/Product/ImageCarousel'
import { ProductInformation } from '@/views/Product/ProductInformation'
import { ProductVariants } from '@/views/Product/ProductVariants'

export const revalidate = 3600

export const dynamic = 'force-static'

export const dynamicParams = true

interface ProductProps {
  params: { slug: string }
}

export default async function Product({ params: { slug } }: ProductProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductView slug={slug} />
    </Suspense>
  )
}

async function ProductView({ slug }: { slug: string }) {
  const product = await getProduct(removeOptionsFromUrl(slug))
  console.log(slug)

  const { color, size } = getOptionsFromUrl(slug)
  const hasInvalidOptions =
    !hasValidOption(product?.variants, 'color', color) ||
    !hasValidOption(product?.variants, 'size', size)

  if (!product || hasInvalidOptions) {
    return notFound()
  }

  const combination = getCombination(product, color, size)
  const lastCollection = product?.collections?.findLast(Boolean)
  const hasOnlyOneVariant = product.variants.length <= 1

  return (
    <div className='relative mx-auto max-w-container-md px-4 xl:px-0'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(product, slug)) }}
      ></script>
      <div className='mb:pb-8 relative w-fit py-4 md:pt-12'>
        <GoBack className='mb-8 hidden md:block' />
      </div>
      <main className='mx-auto max-w-container-sm'>
        {/* <Breadcrumbs className="mb-8" items={makeBreadcrumbs(product)} /> */}
        <div className='grid grid-cols-1 justify-center gap-10 md:grid-cols-2 lg:gap-20'>
          <ImageCarousel images={product.images}>
            {/* <FavoriteMarker handle={product.handle} /> */}
          </ImageCarousel>
          <div className='flex flex-col items-start pt-12'>
            <ProductInformation className="pb-6" title={product.title} description={product.descriptionHtml} combination={combination} />
            {hasOnlyOneVariant ? null : <ProductVariants combination={combination} handle={product.handle} className="pb-4" variants={product.variants} />}

            <ProductDetails slug={slug} product={product} />
          </div>
        </div>
      </main>
      <Suspense fallback={<SimilarProductsSectionSkeleton />}>
        {/* <SimilarProductsSection collection={lastCollection?.title} slug={slug} /> */}
      </Suspense>
    </div>
  )
}

function makeBreadcrumbs(product: PlatformProduct) {
  const lastCollection = product.collections?.findLast(Boolean)

  return {
    Home: '/',
    [lastCollection?.title || 'Products']: lastCollection?.handle
      ? `/category/${lastCollection.handle}`
      : '/search',
    [product.title]: '',
  }
}
