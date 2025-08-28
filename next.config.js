/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental features for compatibility
  // experimental: {
  //   ppr: true,
  // },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',
      },
    ],
  },
  
  // Enable static exports for better performance
  output: 'standalone',
  
  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configure redirects for better SEO
  async redirects() {
    return [
      {
        source: '/',
        destination: '/uk',
        permanent: false,
      },
    ];
  },
  
  // Configure rewrites for API proxying (optional)
  async rewrites() {
    const apiBaseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.API_BASE_URL || 'http://backend:8000'
      : 'http://localhost:8000';
      
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: '/check/:path*',
        destination: `${apiBaseUrl}/check/:path*`,
      },
      {
        source: '/login',
        destination: `${apiBaseUrl}/login`,
      },
      {
        source: '/logout',
        destination: `${apiBaseUrl}/logout`,
      },
      {
        source: '/me',
        destination: `${apiBaseUrl}/me`,
      },
    ];
  },
  
  // Bundle analyzer (for development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
      return config;
    },
  }),
  
  // Optimize build performance
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Configure ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // PoweredByHeader
  poweredByHeader: false,
  
  // Environment variables
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;
