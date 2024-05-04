import withVercelToolbar from '@vercel/toolbar/plugins/next'
import withBundleAnalyzer from '@next/bundle-analyzer'
import withPlugins from 'next-compose-plugins'

/** @type {import('next').NextConfig} */
const nextConfig = withPlugins([[withVercelToolbar(), withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })]], {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    imageSizes: [256, 384],
    deviceSizes: [320, 500, 750, 1080, 1200],
    minimumCacheTTL: 31_556_926,
    formats: ['image/webp'],
    // remotePatterns: [{}],
  },
})

export default nextConfig
