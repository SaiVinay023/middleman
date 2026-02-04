import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Capacitor: converts Next.js into static HTML/CSS/JS
  output: 'export', 
  
  // Mobile apps don't have a backend image optimization server
  images: {
    unoptimized: true,
  },

    // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Prevents issues with Capacitor's local file protocol
  trailingSlash: true, 
};

export default nextConfig;