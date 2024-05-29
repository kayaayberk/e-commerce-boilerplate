import { PlatformProduct } from '@/packages/core/platform/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function denormalizeId(id: string) {
  return id.startsWith('gid://shopify/Product/') ? id : `gid://shopify/Product/${id}`
}

export function normalizeId(id: string) {
  const shopifyIdPrefix = 'gid://shopify/Product/'
  return id.replace(shopifyIdPrefix, '')
}

export function normalizeUserId(id: string) {
  const shopifyIdPrefix = 'gid://shopify/Customer/'
  return id?.replace(shopifyIdPrefix, '')
}

export function denormalizeUserId(id: string) {
  return id.startsWith('gid://shopify/Customer/') ? id : `gid://shopify/Customer/${id}`
}

export function makeBreadcrumbs(product: PlatformProduct) {
  const lastCollection = product.collections?.findLast(Boolean)

  return {
    Home: '/',
    [lastCollection?.title || 'Products']: lastCollection?.handle
      ? `/category/${lastCollection.handle}`
      : '/search',
    [product.title]: '',
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const runAsyncFnWithoutBlocking = (fn: (...args: any) => Promise<any>) => {
  fn()
}
