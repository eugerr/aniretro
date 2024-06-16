// Import necessary constants from next/constants.js
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js'

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 's4.anilist.co' },
      { hostname: 'media.kitsu.io' },
    ],
  },
}

const nextConfigFunction = async (phase) => {
  // Add your rewrites configuration here
  const rewrites = async () => {
    return [
      {
        source: '/',
        destination: process.env.BACKEND_URL,
      },
    ]
  }

  // Conditional configuration based on phase
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = (await import('@ducanh2912/next-pwa')).default({
      dest: 'public',
    })

    // Merge rewrites with nextConfig
    return withPWA({ ...nextConfig, rewrites })
  }

  // Merge rewrites with nextConfig
  return { ...nextConfig, rewrites }
}

export default nextConfigFunction
