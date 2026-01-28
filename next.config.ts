import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Capacitor: converts Next.js into static HTML/CSS/JS
  output: 'export', 
  
  // Mobile apps don't have a backend image optimization server
  images: {
    unoptimized: true,
  },
  
  // Prevents issues with Capacitor's local file protocol
  trailingSlash: true, 
};

export default nextConfig;