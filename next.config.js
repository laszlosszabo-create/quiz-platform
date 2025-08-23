/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is default in Next.js 15
  
  // No basePath in Vercel deployment; static export path prefix removed
  
  // trailingSlash removed to avoid breaking API route resolution
  
  // Dynamic deploy on Vercel (no static export) so API routes work
  
  webpack: (config, { dev }) => {
    // Disable webpack filesystem cache in dev to avoid stale pack.gz ENOENT issues
    if (dev) {
      config.cache = false
    }
    return config
  },
};

module.exports = nextConfig;
