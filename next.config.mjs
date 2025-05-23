import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Example Turbopack configuration
    resolveExtensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    resolveAlias: {
      // Add your aliases here, e.g.:
      // '@components': './components',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.43.157',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

const withPWA = nextPWA({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

export default withPWA(nextConfig);
