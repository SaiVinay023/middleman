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
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin'
        },
        {
          key: 'Cross-Origin-Resource-Policy',
          value: 'same-origin'
        },
          { 
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js needs unsafe-eval
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://warm-cicada-49280.upstash.io https://api.cloudinary.com",
          "frame-ancestors 'none'",
        ].join('; ')
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
  
  // Prevents issues with Capacitor's local file protocol
  trailingSlash: true, 
};

export default nextConfig;