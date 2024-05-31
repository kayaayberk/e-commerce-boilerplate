import { getCombination, getOptionsFromUrl, hasValidOption, removeOptionsFromUrl } from '@/lib/productOptionsUtils'
import { SimilarProductsSectionSkeleton } from '@/views/ProductListing/Product/SimilarProductsSectionSkeleton'
import { SimilarProductsSection } from 'views/Product/SimilarProductsSection'
import { ProductInformation } from '@/views/Product/ProductInformation'
import type { PlatformProduct } from '@/packages/core/platform/types'
import { ProductVariants } from '@/views/Product/ProductVariants'
import { Breadcrumbs } from 'components/Breadcrumbs/Breadcrumbs'
import { ProductDetails } from '@/views/Product/ProductDetails'
import { storefrontClient } from '@/clients/storeFrontClient'
import { PageSkeleton } from '@/views/Category/PageSkeleton'
import ImageCarousel from '@/views/Product/ImageCarousel'
import { GoBack } from '@/views/Product/GoBack'
import { slugToName } from '@/lib/slug-name'
import type { CommerceProduct } from 'types'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'

export const dynamic = 'force-static'

export const revalidate = 1

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

export async function generateStaticParams() {
  return []
}

async function ProductView({ slug }: { slug: string }) {
  const product = await getDraftAwareProduct(slug)

  const { color, size } = getOptionsFromUrl(slug)
  const hasInvalidOptions =
    !hasValidOption(product?.variants, 'color', color) ||
    !hasValidOption(product?.variants, 'size', size)

  if (!product || hasInvalidOptions) {
    return notFound()
  }

  const combination = getCombination(product as CommerceProduct, color, size)
  const lastCollection = product?.collections?.findLast(Boolean)
  const hasOnlyOneVariant = product.variants.length <= 1

  return (
    <div className='relative mx-auto max-w-container-md px-4 xl:px-0'>
      <div className='mb:pb-8 relative w-fit py-4 md:pt-12'>
        <GoBack className='mb-8 hidden md:block' />
      </div>
      <main className='mx-auto max-w-container-sm'>
        <Breadcrumbs className='mb-8 hidden md:block' items={makeBreadcrumbs(product)} />
        <div className='grid grid-cols-1 justify-center gap-10 md:grid-cols-2 lg:gap-20'>
          <ImageCarousel images={product.images} />
          <div className='flex flex-col items-start pt-12'>
            <ProductInformation
              className='pb-10'
              title={product.title}
              description={product.descriptionHtml}
              combination={combination}
            />
            {hasOnlyOneVariant ? null : (
              <ProductVariants
                combination={combination}
                handle={product.handle}
                variants={product.variants}
              />
            )}
            <ProductDetails slug={slug} product={product as CommerceProduct} />
          </div>
        </div>
      </main>
      <Suspense fallback={<SimilarProductsSectionSkeleton />}>
        <SimilarProductsSection id={product?.id} />
      </Suspense>
    </div>
  )
}

async function getDraftAwareProduct(slug: string) {
  const draft = draftMode()

  let product = await storefrontClient.getProductByHandle(removeOptionsFromUrl(slug))
  if (draft.isEnabled && product) product = await getAdminProduct(product?.id)

  return product
}

const getAdminProduct = unstable_cache(
  async (id: string) => storefrontClient.getAdminProduct(id),
  ['admin-product-by-handle'],
  { revalidate: 1 }
)

function makeBreadcrumbs(product: PlatformProduct) {
  const lastCollection = product.collections?.findLast(Boolean)

  return {
    Home: '/',
    [lastCollection?.handle ? slugToName(lastCollection.handle) : 'Products']:
      lastCollection?.handle ? `/category/${lastCollection.handle}` : '/search',
    [product.title]: '',
  }
}
