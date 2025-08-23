/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is default in Next.js 15
  
  // No basePath in Vercel deployment; static export path prefix removed
  
  // trailingSlash removed to avoid breaking API route resolution
  
  // Static export for shared hosting deployment
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  
  // Unoptimized images for static export
  images: process.env.STATIC_EXPORT === 'true' ? {
    unoptimized: true
  } : undefined,
  
  webpack: (config, { dev }) => {
    // Disable webpack filesystem cache in dev to avoid stale pack.gz ENOENT issues
    if (dev) {
      config.cache = false
    }
    return config
  },
};

module.exports = nextConfig;
