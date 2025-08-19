import 'dotenv/config';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_SECRET_KEY: process.env.NEXT_SECRET_KEY,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_SITE_NAME: process.env.SITE_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  typescript: {
    // !! WARN !!
    // This setting should be temporary - once types are fixed, set it back to true
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
    
    dangerouslyAllowSVG: true, // Enable SVG support
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60, // Increase cache time to reduce timeouts
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   workerThreads: false, // Disable worker threads for automatic static generation
  //   cpus: 2 // Limit Next.js to 4 CPU cores for parallel processing
  // },

  // distDir: 'build', // Change the output directory for Next.js build files
};

export default nextConfig;
