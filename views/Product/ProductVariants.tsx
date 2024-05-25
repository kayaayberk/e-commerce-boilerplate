'use client'

import { Combination, createOptionfulUrl, getAllCombinations } from "@/lib/productOptionsUtils"
import { PlatformVariant } from "@/packages/core/platform/types"
import { useCartStore } from "@/lib/stores/cartStore"
import { Variant } from "./Variant"
import { cn } from "@/lib/utils"


interface ProductVariantsProps {
    variants: PlatformVariant[]
    className?: string
    combination: Combination | undefined
    handle: string
  }
  

export function ProductVariants({ variants, className, handle, combination }: ProductVariantsProps) {
    const combinations = getAllCombinations(variants)
    const cart = useCartStore((s) => s.cart)
  
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <p className="text-sm text-neutral-500">Select variant</p>
        <div className="relative flex w-full flex-wrap gap-2">
          {combinations.map((singleCombination) => {
            const cartItem = cart?.items.find((item) => item.merchandise.id === singleCombination?.id)
            return (
              <Variant
                cartItem={cartItem}
                key={singleCombination.id}
                href={createOptionfulUrl(handle, singleCombination.size, singleCombination.color)}
                singleCombination={singleCombination}
                isActive={singleCombination.id === combination?.id}
              />
            )
          })}
        </div>
      </div>
    )
  }