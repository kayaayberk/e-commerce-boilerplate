import { PlatformProduct, PlatformVariant } from '@/packages/core/platform/types'
import { addCartItem, getItemAvailability } from '@/app/actions/cart.actions'
import { useAddProductStore } from '@/lib/stores/addProductStore'
import { Combination } from '@/lib/productOptionsUtils'
import { useCartStore } from '@/lib/stores/cartStore'
import { COOKIE_CART_ID } from 'constants/index'
import { Button } from '@/components/ui/button'
import { getCookie } from '@/lib/getCookie'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from "sonner"

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

    if (!res.ok) toast.error("Out of stock")

    refresh()
  }

  useEffect(() => {
    const checkStock = async () => {
      const cartId = getCookie(COOKIE_CART_ID)
      const itemAvailability = await getItemAvailability(cartId, combination?.id)

      itemAvailability && setHasAnyAvailable(itemAvailability.inCartQuantity < (combination?.quantityAvailable || 0))
    }

    checkStock()
  }, [combination?.id, isPending, combination?.quantityAvailable, cart?.items])

  return (
    <Button
      onClick={handleClick}
      variant="default"
      size="lg"
      className={cn("relative w-fit rounded-lg transition-transform hover:scale-105 hover:text-white", className)}
      disabled={isPending || disabled}
    >
      Add to Cart
    </Button>
  )
}