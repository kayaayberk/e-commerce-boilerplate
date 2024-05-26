"use client"

import { AddToCartButtonSkeleton, FaqSectionSkeleton } from "../ProductListing/Product/PageSkeleton"
import { getCombination, getOptionsFromUrl } from "@/lib/productOptionsUtils"
import { PlatformProduct } from "@/packages/core/platform/types"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import dynamic from "next/dynamic"
import { useRef } from "react"

const AddToCartButton = dynamic(() => import("views/Product/AddToCartButton").then((module) => module.AddToCartButton), { loading: AddToCartButtonSkeleton })
const ProductFaq = dynamic(() => import("views/Product/ProductFaq").then((module) => module.FaqSection), { loading: FaqSectionSkeleton })

export function ProductDetails({ product, slug }: { product: PlatformProduct; slug: string }) {
  const hasLoaded = useRef(false)
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  })

  const { color, size } = getOptionsFromUrl(slug)
  const combination = getCombination(product, color, size)

  if (!hasLoaded.current && entry?.isIntersecting) {
    hasLoaded.current = true
  }

  return (
    <div ref={ref} className="w-full">
      {hasLoaded.current && (
        <>
          <AddToCartButton className="my-8" combination={combination} product={product} slug={slug} />
          <ProductFaq className="mt-12 flex flex-col gap-5" />
        </>
      )}
    </div>
  )
}