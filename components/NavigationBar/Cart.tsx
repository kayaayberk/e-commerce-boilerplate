'use client'

import { useCartStore } from '@/lib/stores/cartStore'
import { OpenCartButton } from './OpenCartButton'
import { Icons } from '../Icons/Icons'
import { cn } from '@/lib/utils'

interface CartProps {
  className?: string
}

export function Cart({ className }: CartProps) {
  const preloadSheet = useCartStore((s) => s.preloadSheet)
  const cart = useCartStore((s) => s.cart)

  return (
    <div
      className={cn(
        'relative cursor-pointer items-center justify-center fill-none transition-transform hover:scale-105',
        className
      )}
      onMouseOver={preloadSheet}
    >
      <Icons.Cart />
      {!!cart?.totalQuantity && (
        <div className='absolute bottom-0 right-0 flex size-4 items-center justify-center rounded-full bg-black text-[11px] text-white'>
          {cart?.totalQuantity}
        </div>
      )}
      <OpenCartButton />
    </div>
  )
}
