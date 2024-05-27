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
    <div className={cn('relative flex max-w-full flex-col gap-16', className)}>
      <Carousel setApi={setApi} className='relative flex items-center justify-center w-full pt-12'>
        <CarouselContent className='m-0 rounded-xl'>
          {images.map((image, index) => (
            <CarouselItem
              className='flex size-full max-h-[400px] items-center justify-center rounded-xl overflow-hidden p-0'
              key={image.url}
            >
              <Image
                alt={image.altText || ''}
                src={image.url}
                width={480}
                height={400}
                priority={index === 0}
                className='mx-auto object-contain'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-0 translate-y-8'>
          {hasOnlyOneImage ? null : <CarouselPrevious />}
          {hasOnlyOneImage ? null : <CarouselNext />}
        </div>
      </Carousel>

      <Carousel setApi={setThumbsApi} opts={{ skipSnaps: true }}>
        <CarouselContent className='ml-0 h-[100px] w-full justify-start gap-6'>
          {images.map((image, index) => (
            <div
              key={'thumbnail_' + image.url}
              onClick={() => onThumbClick(index)}
              className={cn(
                'flex size-24 shrink-0 items-center overflow-hidden rounded-xl justify-center border border-white bg-neutral-100',
                { 'border-black': index === current - 1 }
              )}
            >
              <Image
                alt={image.altText || ''}
                src={image.url}
                width={100}
                height={100}
                sizes='100px'
                className='object-contain'
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
