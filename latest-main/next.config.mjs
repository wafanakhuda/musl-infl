/** @type {import('next').NextConfig} */
const nextConfig = {
  
  
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ IMPORTANT: Prevent Next.js from trying static HTML export
  output: 'standalone',
}

export default nextConfig
