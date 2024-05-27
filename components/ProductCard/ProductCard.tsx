'use client'

import { CurrencyType, mapCurrencyToSign } from '@/lib/mapCurrencyToSign'
import { cn } from '@/lib/utils'
import { PlatformImage, PlatformProduct } from '@/packages/core/platform/types'

import Image from 'next/image'
import Link from 'next/link'
import { Carousel, CarouselApi, CarouselContent } from '../ui/carousel'
import { useCallback, useEffect, useState } from 'react'

// import { QuickAdd } from "./QuickAdd"

interface ProductCardProps
  extends Pick<
    PlatformProduct,
    'variants' | 'handle' | 'images' | 'title' | 'featuredImage' | 'minPrice'
  > {
  priority?: boolean
  className?: string
}

export function ProductCard(props: ProductCardProps) {
  const [image, setImage] = useState<PlatformImage>({ url: props.featuredImage?.url || '' })
  const hasOnlyOneImage = props.images.length <= 1
  const variant = props.variants?.find(Boolean)?.price
  const href = `/products/${props.handle}`
  const linkAria = `Visit product: ${props.title}`
  const featuredImageAltTag =
    props.images?.find((singleImage) => singleImage.url === props.featuredImage?.url)?.altText || ''

  const onHoversetImage = (index: number) => {
    if (hasOnlyOneImage) return

    setImage(() => props.images[index])
  }

  return (
    <div className={cn('group relative space-y-1 p-0 md:bg-transparent md:p-0', props.className)}>
      <div className='relative flex size-full min-h-[100px] items-center justify-center rounded-xl shadow-md transition-shadow duration-300 group-hover:shadow-lg'>
        <Link
          aria-label={linkAria}
          href={href}
          className='transform-[translateZ(0)] relative z-[2] size-[200px] overflow-hidden rounded-xl md:size-[300px]'
        >
          <Image
            key={image.url + 'featured'}
            alt={featuredImageAltTag}
            className='animate-reveal z-0 select-none object-cover transition-transform duration-300 group-hover:scale-105'
            fill
            src={image.url}
            priority={props.priority}
          />
        </Link>

        {/* <QuickAdd product={props as PlatformProduct} variants={props.variants} /> */}
      </div>

      <Link aria-label={linkAria} href={href}>
        <div className='mt-2 flex flex-col gap-0.5 text-slate-700'>
          <div className='line-clamp-2 tracking-tight md:text-md'>{props.title}</div>
          {!!variant && !!props.minPrice && (
            <p className='text-sm font-medium tracking-tight text-black'>
              From{' '}
              {props.minPrice.toFixed(2) + mapCurrencyToSign(variant.currencyCode as CurrencyType)}
            </p>
          )}
        </div>
      </Link>
      <div className='flex cursor-pointer items-center gap-1'>
        {props.images.map((image, index) => (
          <div
            key={'thumbnail_' + image.url}
            className={cn(
              'flex size-[30px] items-center justify-center overflow-hidden rounded-lg bg-neutral-100'
            )}
            onClick={() => onHoversetImage(index)}
          >
            <Image
              alt={image.altText || ''}
              src={image.url}
              width={30}
              height={30}
              priority={props.priority}
              className={cn('object-contain')}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
