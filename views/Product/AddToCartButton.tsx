import { PlatformProduct, PlatformVariant } from '@/packages/core/platform/types'
import { Combination } from '@/lib/productOptionsUtils'
import { useCartStore } from '@/lib/stores/cartStore'
import { COOKIE_CART_ID } from 'constants/index'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

import { getCookie } from 'utils/getCookie'
import { useToast } from '@/components/ui/use-toast'

export function AddToCartButton({
  className,
  product,
  combination,
}: {
  className?: string
  product: PlatformProduct
  combination: Combination | PlatformVariant | undefined
  slug: string
}) {
  const [isPending, setIsPending] = useState(false)
  const [hasAnyAvailable, setHasAnyAvailable] = useState(true)
  const { setProduct, clean } = useAddProductStore()
  const { cart, refresh } = useCartStore((s) => s)
  const { toast } = useToast()

  const disabled = !hasAnyAvailable || !combination?.availableForSale || isPending

  // Mimic delay and display optimistic UI due to shopify API being slow
  const handleClick = async () => {
    if (!combination?.id) return

    setIsPending(true)

    setTimeout(() => {
      setProduct({ product, combination })
      setIsPending(false)
    }, 300)

    setTimeout(() => clean(), 4500)

    const res = await addCartItem(null, combination.id)

    if (!res.ok)
      toast({
        title: 'An error occurred',
        description: '"Out of stock"',
      })

    refresh()
  }

  useEffect(() => {
    const checkStock = async () => {
      const cartId = getCookie(COOKIE_CART_ID)
      const itemAvailability = await getItemAvailability(cartId, combination?.id)

      itemAvailability &&
        setHasAnyAvailable(itemAvailability.inCartQuantity < (combination?.quantityAvailable || 0))
    }

    checkStock()
  }, [combination?.id, isPending, combination?.quantityAvailable, cart?.items])

  return (
    <Button
      onClick={handleClick}
      variant='secondary'
      size='lg'
      className={cn(
        'relative w-fit rounded-xl transition-transform hover:scale-105 hover:text-white',
        className
      )}
      
      disabled={isPending || disabled}
    >
      Add to Cart
    </Button>
  )
}
