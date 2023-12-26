/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.43.157',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api-caelium.jerit.in',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
}

module.exports = nextConfig
