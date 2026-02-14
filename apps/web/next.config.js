const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
    // React Compiler requires babel-plugin-react-compiler, disable for now
    // reactCompiler: true,
    // Allow cross-origin requests from specific IPs during development
    // allowedDevOrigins: ['10.66.130.47']
  },

  // Enable SCSS support (loadPaths replaces includePaths in sass-loader v16)
  sassOptions: {
    loadPaths: [path.join(__dirname, 'src', 'styles')],
    additionalData: `@import "${path.join(__dirname, 'src', 'styles', 'utils', '_variables.scss').replace(/\\/g, '/')}"; @import "${path.join(__dirname, 'src', 'styles', 'utils', '_breakpoints.scss').replace(/\\/g, '/')}";`,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // SEO-friendly static exports for better performance (commented out for dev)
  // output: 'export',
  // trailingSlash: true,

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
