'use client'

import { getParsedFavoritesHandles, toggleFavoriteProduct } from '@/app/actions/favorites.actions'
import { useEffect, useState, useTransition } from 'react'
import { Icons } from '@/components/Icons/Icons'
import { cn } from '@/lib/utils'

export function FavoriteMarker({ handle }: { handle: string }) {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const checkIsFavorite = () => {
      startTransition(async () => {
        const favorites = await getParsedFavoritesHandles()

        setIsActive(favorites.includes(handle))
      })
    }

    checkIsFavorite()
  }, [handle])

  const handleClick = () => {
    startTransition(async () => {
      const isFavorite = await toggleFavoriteProduct(null, handle)
      setIsActive(isFavorite)
    })
  }

  return (
    <div className='absolute left-6 top-4'>
      <button
        aria-label='Favorite this item'
        type='submit'
        className='relative bg-transparent'
        onClick={handleClick}
      >
        {!isPending ? (
          <Icons.Heart
            className={cn('size-8 cursor-pointer transition-colors hover:fill-neutral-200', {
              'fill-black': isActive,
            })}
          />
        ) : (
          <div className='relative items-center justify-center '>
            <Icons.Spinner className='size-8 animate-spin bg-transparent' />
          </div>
        )}
      </button>
    </div>
  )
}
