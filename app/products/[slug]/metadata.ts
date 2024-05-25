import { removeOptionsFromUrl } from '@/lib/productOptionsUtils'
import { PlatformProduct } from '@/packages/core/platform/types'
import { getProduct } from '@/app/actions/product.actions'
import { makeKeywords } from '@/lib/keywordUtils'
import { Product, WithContext } from 'schema-dts'
import { Metadata } from 'next'
import { env } from '@/env'

interface ProductProps {
  params: { slug: string }
}

export async function generateMetadata({ params: { slug } }: ProductProps): Promise<Metadata> {
  const product = await getProduct(removeOptionsFromUrl(slug))

  const originalDescription = product?.seo?.description
  const originalTitle = product?.seo?.title
  const keywords = makeKeywords(product?.title)
  const lastCollection = product?.collections?.findLast(Boolean)

  return {
    metadataBase: new URL(env.LIVE_HEADLESS_URL!), // TODO: CHANGE THIS TO LIVE URL
    title: `${originalTitle || product?.title} | Blazity`,
    description: originalDescription || product?.description,
    generator: 'Next.js',
    applicationName: 'Next.js',
    referrer: 'origin-when-cross-origin',
    keywords: keywords,
    category: lastCollection?.title,
    creator: 'Blazity',
    alternates: {
      canonical: `/products/${slug}`,
    },
    publisher: 'Blazity',
  }
}

export function generateJsonLd(product: PlatformProduct, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    ...(product.vendor && {
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
    }),
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
    offers: {
      '@type': 'Offer',
      url: `${env.LIVE_HEADLESS_URL}/products/${slug}`,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
    },
  } satisfies WithContext<Product>
}
