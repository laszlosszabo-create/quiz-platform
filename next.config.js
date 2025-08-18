/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is default in Next.js 15
  webpack: (config, { dev }) => {
    // Disable webpack filesystem cache in dev to avoid stale pack.gz ENOENT issues
    if (dev) {
      config.cache = false
    }
    return config
  },
};

module.exports = nextConfig;
