import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface FacetProps {
  id: string
  title: string
  distribution: Record<string, number> | undefined
  isChecked: (value: string) => boolean
  onCheckedChange: (checked: boolean, value: string) => void
}

export function Facet({ id, title, distribution, isChecked, onCheckedChange }: FacetProps) {
  const distributionsEntries = Object.entries(distribution || {})
  const hasNoResults = distributionsEntries.length === 0

  return (
    <AccordionItem value={id}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {hasNoResults ? (
          <p className='text-[14px] text-neutral-500'>No {title?.toLowerCase()} found</p>
        ) : (
          <div className='flex flex-col gap-3'>
            {distributionsEntries.map(([value, noOfItems], index) => (
              <Label key={value + index} className='flex items-center gap-1 font-normal'>
                <Checkbox name={value} checked={isChecked(value)} onCheckedChange={(checked) => onCheckedChange(!!checked, value)} />
                {value} ({noOfItems} items)
              </Label>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

export default Facet
