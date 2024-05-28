"use client"

import { Placeholder } from "@/components/GenericModal/GenericModal"
import { useModalStore } from "@/lib/stores/modalStore"
import { Icons } from "@/components/Icons/Icons"
import dynamic from "next/dynamic"


const GenericModal = dynamic(() => import("@/components/GenericModal/GenericModal").then((m) => m.GenericModal), { loading: Placeholder })
const FacetsContent = dynamic(() => import("@/views/ProductListing/FacetsContent").then((m) => m.FacetsContent))

export type CategoriesDistribution = {
  [category: string]: number
}
interface FacetsMobileProps {
  className?: string
  facetDistribution: Record<string, CategoriesDistribution> | undefined
  disabledFacets?: string[]
}

export function FacetsMobile({ className, facetDistribution, disabledFacets }: FacetsMobileProps) {
  const { modals, openModal, closeModal } = useModalStore()

  return (
    <div className={className}>
      <div onClick={() => openModal("facets-mobile")}>
        <Icons.Filters size={18} />
      </div>
      {!!modals["facets-mobile"] && (
        <GenericModal title="Filters" open={!!modals["facets-mobile"]} onOpenChange={() => closeModal("facets-mobile")}>
          <FacetsContent facetDistribution={facetDistribution} disabledFacets={disabledFacets} />
        </GenericModal>
      )}
    </div>
  )
}