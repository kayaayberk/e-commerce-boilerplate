import { PlatformVariant } from "@/packages/core/platform/types"
import { Combination } from "@/lib/productOptionsUtils"



interface ProductInformationProps {
    title: string
    description: string
    combination: Combination | PlatformVariant | undefined
    className?: string
  }

export function ProductInformation({ title, description, combination, className }: ProductInformationProps) {
    return (
        <div className={className}>
          <h1 className="mb-6 text-xl/6 tracking-[-1px] md:text-4xl">{title}</h1>
          {description && <div className="leading-tight tracking-normal text-neutral-500 space-y-4 text-sm" dangerouslySetInnerHTML={{ __html: description }} />}
          {!!combination?.price && (
            <div className="mt-4 text-[36px] font-bold tracking-[-1.44px]">{parseFloat(combination?.price.amount).toFixed(2) + " " + combination?.price.currencyCode}</div>
          )}
        </div>
      )
    }