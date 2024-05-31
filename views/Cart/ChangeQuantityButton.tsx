import { updateItemQuantity } from 'app/actions/cart.actions'
import { useCartStore } from '@/lib/stores/cartStore'
import { Icons } from '@/components/Icons/Icons'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface ChangeQuantityButtonProps {
  id: string
  variantId: string
  quantity: number
  children: React.ReactNode
}

export function ChangeQuantityButton({
  id,
  variantId,
  quantity,
  children,
}: ChangeQuantityButtonProps) {
  const refresh = useCartStore((prev) => prev.refresh)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const { ok, message } = await updateItemQuantity(null, { itemId: id, variantId, quantity })

      if (!ok && message) {
        toast.warning(message)
      }

      refresh()
    })
  }

  return (
    <div className='relative flex h-full w-fit items-center'>
      <button
        className='flex cursor-pointer items-center gap-2 bg-transparent transition-transform hover:scale-150'
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? <Icons.Spinner className='size-2' /> : children}
      </button>
    </div>
  )
}
