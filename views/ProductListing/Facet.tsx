import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"







interface FacetProps {
    id: string
    title: string
    distribution: Record<string, number> | undefined
    isChecked: (value: string) => boolean
    onCheckedChange: (checked: boolean, value: string) => void
  }
  
  export function Facet() {
  return (
    <AccordionItem value='item-1'>
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </AccordionItem>
  )
}

export default Facet
