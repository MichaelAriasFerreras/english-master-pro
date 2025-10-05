
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: 'standalone',
  
  // Security Headers - Critical for 10/10 Security Score
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
          }
        ],
      },
    ];
  },
  
  // Performance Optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image Optimization
  images: { 
    unoptimized: false,
    domains: ['ssl.gstatic.com'], // For audio/pronunciation URLs
    formats: ['image/avif', 'image/webp'],
  },
  
  // Code Splitting and Optimization
  experimental: {
    optimizeCss: true,
  },
  
  // Production Optimization
  swcMinify: true,
  
  // Build Configuration
  eslint: {
    ignoreDuringBuilds: false, // Enable linting for better code quality
  },
  typescript: {
    ignoreBuildErrors: false, // Enable type checking for better quality
  },
  
  // Compression
  compress: true,
  
  // React Strict Mode for Better Performance
  reactStrictMode: true,
  
  // PoweredByHeader removal for security
  poweredByHeader: false,
};

module.exports = nextConfig;
