/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Next.js 15+ with React 19
  experimental: {
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
    // React Compiler requires babel-plugin-react-compiler, disable for now
    // reactCompiler: true,
    // Allow cross-origin requests from specific IPs during development
    allowedDevOrigins: ['10.66.130.47']
  },

  // Enable SCSS support
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: `@import "./src/styles/utils/_variables.scss";`,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Performance optimizations
  // swcMinify is now enabled by default in Next.js 15+

  // SEO-friendly static exports for better performance
  output: 'export',
  trailingSlash: true,

  // Image optimization for static export
  images: {
    unoptimized: true,
  },

  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;