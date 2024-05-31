import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PlatformCart } from '@/packages/core/platform/types'
import { Icons } from '@/components/Icons/Icons'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { CartItem } from './CartItem'
import { cn } from '@/lib/utils'

interface CartSheetProps {
  cart: PlatformCart | null
  onCartClose: () => void
  onCartOpen: () => void
  isOpen: boolean
  isPending: boolean
}

export function CartSheet({ cart, isOpen, onCartClose, isPending }: CartSheetProps) {
  const router = useRouter()

  const hasAnyItems = (cart?.items?.length || 0) > 0
  const subtotalFormatted =
    cart?.cost?.subtotalAmount?.amount + ' ' + cart?.cost?.subtotalAmount?.currencyCode
  const totalFomatted =
    cart?.cost?.totalAmount?.amount + ' ' + cart?.cost?.totalAmount?.currencyCode

  return (
    <Sheet open={isOpen} onOpenChange={() => onCartClose()}>
      <SheetContent className='size-full min-h-svh bg-white p-0'>
        <SheetHeader className='mb-4 flex w-full flex-row items-center justify-between border-b border-black'>
          <SheetTitle className='flex items-center p-4 text-md font-normal'>
            Review your cart
            {isPending ? <Icons.Spinner className='ml-4' /> : null}
          </SheetTitle>

          <SheetClose className='absolute right-4 top-4 rounded-sm bg-white opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'>
            <span className='sr-only'>Close</span>
          </SheetClose>
        </SheetHeader>

        {!hasAnyItems && <CartEmptyState />}

        <div
          className={cn(
            'mb-4 flex size-full h-[calc(100%-63px-260px)] flex-col gap-4 overflow-x-hidden p-4'
          )}
        >
          {cart?.items.map((singleItem) => (
            <CartItem
              className={cn(isPending && 'pointer-events-none')}
              {...singleItem}
              key={singleItem.id + '_' + singleItem.merchandise.id}
              onProductClick={() => onCartClose()}
            />
          ))}
        </div>

        {hasAnyItems && (
          <SheetFooter className='border-t border-black p-4'>
            <div className='w-full bg-white py-4 text-sm text-neutral-500'>
              <div className='mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 '>
                <p>Subtotal</p>
                <p className='text-right text-base text-black '>{subtotalFormatted}</p>
              </div>
              <div className='mb-3 flex items-center justify-between border-b border-neutral-200 py-1 '>
                <p>Shipping</p>
                <p className='text-right'>Calculated at checkout</p>
              </div>
              <div className='mb-3 flex items-center justify-between border-b border-neutral-200 py-1 '>
                <p>Total</p>
                <p className='text-right text-base text-black '>{totalFomatted}</p>
              </div>
              <Button
                variant='secondary'
                className='w-full justify-center text-center hover:text-white'
                size='lg'
                onClick={() => router.push(cart?.checkoutUrl!)}
              >
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CartEmptyState() {
  return (
    <div className='flex size-full flex-col items-center justify-center gap-2 text-[21px] font-normal text-black'>
      <Icons.Cart className='size-20' />
      <p>Your cart is empty</p>
    </div>
  )
}
