const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shiki использует WASM и динамические импорты — нужен внешний модуль для Turbopack
  serverExternalPackages: ['shiki'],

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
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Standalone output для Docker-контейнеризации (PW-043)
  output: 'standalone',

  // Image optimization (без встроенного оптимизатора)
  images: {
    unoptimized: true,
  },

  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
