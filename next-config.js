/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Next.js 15
  experimental: {
    // Enable Server Components by default
    serverComponentsExternalPackages: ['gsap'],
    // Optimize bundle size
    optimizeCss: true,
    // Enable React Compiler (experimental)
    reactCompiler: true,
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        // Optimize GSAP imports
        '*.gsap': {
          loaders: ['gsap-loader'],
          as: '*.js',
        },
      },
    },
  },
  
  // GSAP-specific webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize GSAP modules
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Optimize GSAP imports for client-side
        'gsap/dist/gsap': 'gsap/dist/gsap.min.js',
        'gsap/dist/ScrollTrigger': 'gsap/dist/ScrollTrigger.min.js',
        'gsap/dist/TextPlugin': 'gsap/dist/TextPlugin.min.js',
      };
    }
    
    // Optimize performance
    config.optimization = {
      ...config.optimization,
      // Split chunks for better caching
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'gsap',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for GSAP performance
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // PoweredByHeader
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Generate ETags
  generateEtags: true,
  
  // Trailing slash
  trailingSlash: false,
  
  // Strict mode
  reactStrictMode: true,
  
  // SWC minification
  swcMinify: true,
};

module.exports = nextConfig;