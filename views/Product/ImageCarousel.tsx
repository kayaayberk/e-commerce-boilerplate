'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { PlatformImage } from '@/packages/core/platform/types'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

interface ImageCarouselnProps {
  className?: string
  images: PlatformImage[]
  children?: React.ReactNode
}

function ImageCarousel({ className, images, children }: ImageCarouselnProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api || !thumbsApi) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
      thumbsApi.scrollTo(api.selectedScrollSnap())
    })
  }, [api, thumbsApi])

  const onThumbClick = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )
  const hasOnlyOneImage = images.length <= 1

  return (
    <div className={cn('relative flex max-w-full flex-col gap-10 md:max-w-[480px]', className)}>
      <Carousel setApi={setApi} className='relative min-h-[600px] flex items-center w-full '>
        <CarouselContent className='size-full'>
          {images.map((image, index) => (
            <CarouselItem
              className='flex size-full h-[400px] flex-col items-center justify-center'
              key={image.url}
            >
              <Image
                alt={image.altText || ''}
                src={image.url || '/default-product-image.svg'}
                width={480}
                height={600}
                priority={index === 0}
                className='mx-auto object-contain px-4'
                sizes='(max-width: 450px) 300px, 480px'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-0 pb-6'>
          {hasOnlyOneImage ? null : <CarouselPrevious className='relative' />}
          {hasOnlyOneImage ? null : <CarouselNext className='relative' />}
        </div>
      </Carousel>

      <Carousel setApi={setThumbsApi} opts={{ skipSnaps: true }}>
        <CarouselContent className='ml-0 h-[100px] w-full justify-start gap-6'>
          {images.map((image, index) => (
            <div
              key={'thumbnail_' + image.url}
              onClick={() => onThumbClick(index)}
              className={cn(
                'flex size-24 shrink-0 items-center overflow-hidden  justify-center border border-white bg-neutral-100',
                { 'border-black': index === current - 1 }
              )}
            >
              <Image
                alt={image.altText || ''}
                src={image.url}
                width={100}
                height={100}
                sizes='100px'
              />
            </div>
          ))}
        </CarouselContent>
      </Carousel>
      {children}
    </div>
  )
}

export default ImageCarousel
