import { Accordion } from "@/components/ui/accordion"
import Facet from "./Facet"



interface FacetsContentProps {
    facetDistribution:string | undefined
    className?: string
    disabledFacets?: string[]
  }


export function FacetsContent({ facetDistribution, className, disabledFacets }: FacetsContentProps) {
  return (
    <div className={className}>
        <Accordion collapsible type='single' className='w-full'>
            <Facet />
        </Accordion>
    </div>
  )
}

export default FacetsContent