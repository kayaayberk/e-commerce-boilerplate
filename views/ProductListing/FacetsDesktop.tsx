'use client'

import { useWindowSize } from "@uidotdev/usehooks"
import FacetsContent from "./FacetsContent"
import { cn } from "@/lib/utils"


interface FacetsDesktopProps {
    facetDistribution: string | undefined
    className?: string
    disabledFacets?: string[]
  }



  export function FacetsDesktop({ facetDistribution, className, disabledFacets }: FacetsDesktopProps) {
    const { width = 0 } = useWindowSize()
    const isMobile = width! < 1024 && !!width
  
    return isMobile ? null : <FacetsContent facetDistribution={facetDistribution} className={cn(className, "sticky overflow-auto")} disabledFacets={disabledFacets} />
  }

