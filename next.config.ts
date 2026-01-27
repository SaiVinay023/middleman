import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // CRITICAL: Generates the 'out' folder for mobile
  trailingSlash: true,   // Ensures routing works inside native WebViews
  images: {
    unoptimized: true,   // Mobile apps can't use the Next.js Image Optimization server
  },
};

export default nextConfig;
