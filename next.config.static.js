/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is default in Next.js 15
  
  // Production deployment under /tools/ subpath
  basePath: '/tools',
  
  // Ensure trailing slash for consistent routing
  trailingSlash: true,
  
  // Asset prefix for static files in production
  assetPrefix: '/tools',
  
  // Static export configuration
  output: 'export',
  
  // Skip API routes and server-only features for static export
  images: {
    unoptimized: true
  },
  
  webpack: (config, { dev }) => {
    // Disable webpack filesystem cache in dev to avoid stale pack.gz ENOENT issues
    if (dev) {
      config.cache = false
    }
    return config
  },
};

module.exports = nextConfig;
