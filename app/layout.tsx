import './globals.css'

import { mobileInlineScript } from '@/components/NavigationBar/MobileInlineScript'
import NavigationItems from '@/components/NavigationBar/NavigationItems'
import { Modals } from '@/components/Modals/Modals'
import { TopBar } from '@/components/TopBar/TopBar'
import { Footer } from '@/components/Footer/Footer'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import nextDynamic from 'next/dynamic'
import Script from 'next/script'
import { env } from '@/env'
import { Suspense } from 'react'
import { FlagValues } from '@/views/FlagValues'
import { ThirdParties } from '@/views/ThirdParties'
import { DemoModeAlert } from '@/views/DemoModeAlert'
import { CartView } from '@/views/Cart/CartView'

const DraftToolbar = nextDynamic(() => import('@/views/DraftToolbar'), { ssr: false })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Commerce Boilerplate',
  description: 'FULLY TYPESAGE NEXT.JS STOREFRONT FOR SHOPIFY DEVELOPERS',
  metadataBase: new URL(env.LIVE_URL!),
  openGraph: {
    title: 'Next.js Commerce Boilerplate',
    description: 'FULLY TYPESAGE NEXT.JS STOREFRONT FOR SHOPIFY DEVELOPERS',
    images: ['/opengraph-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Commerce Boilerplate',
    description: 'FULLY TYPESAGE NEXT.JS STOREFRONT FOR SHOPIFY DEVELOPERS',
    creator: '@kayaayberkk',
    images: ['/opengraph-image.jpg'],
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
  },
  generator: 'Next.js',
  applicationName: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <body>
        <Script id='mobileMegaMenuLogic' strategy='lazyOnload'>{`${mobileInlineScript}`}</Script>

        <TopBar />

        <NavigationItems />

        {children}

        <Footer />

        <Modals />

        <CartView />

        <Toaster />

        <DraftToolbar />

        <Suspense>
          <FlagValues />
        </Suspense>

        <Suspense>
          <ThirdParties />
        </Suspense>

        <DemoModeAlert />
      </body>
    </html>
  )
}
