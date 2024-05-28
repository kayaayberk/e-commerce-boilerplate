import CategoriesSection, { CategoriesSectionSkeleton } from '@/views/Homepage/CategoriesSection'
import { EverythingUnderAmount } from '@/views/Homepage/EverythingUnderAmount'
import { AnnouncementBar } from '@/components/Announcement/AnnouncementBar'
import { CarouselSectionSkeleton } from '@/views/Homepage/CarouselSection'
import { BestOffersSection } from '@/views/Homepage/BestOffersSection'
import { HeroSection } from '@/views/Homepage/HeroSection'
import { BUCKETS } from 'constants/index'
import { Suspense } from 'react'

export const revalidate = 3600

export const dynamic = 'force-static'

export const dynamicParams = true

type HeroTitles = {
  [key: string]: string
}

export default function Homepage({ params: { bucket } }: { params: { bucket: string } }) {
  const heroTitles: HeroTitles = {
    a: 'Your daily trendsetting deals',
    b: 'Spring into Savings! Up to 60% Off',
  }

  return (
    <div className='flex w-full flex-col'>
      <HeroSection title={heroTitles[bucket]} />
      <AnnouncementBar className='-order-2 md:-order-1' />

      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<CarouselSectionSkeleton />}>
        <BestOffersSection />
      </Suspense>

      <Suspense fallback={<CarouselSectionSkeleton />}>
        <EverythingUnderAmount />
      </Suspense>
    </div>
  )
}

export async function generateStaticParams() {
  return BUCKETS.HOME.map((bucket) => ({ bucket }))
}
