import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js Commerce Boilerplate',
    short_name: 'Next.js Commerce Boilerplate',
    description: 'FULLY TYPESAGE NEXT.JS STOREFRONT FOR SHOPIFY DEVELOPERS',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
