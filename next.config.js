/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    workerThreads: false,
    cpus: 1,
  },
}

module.exports = nextConfig
