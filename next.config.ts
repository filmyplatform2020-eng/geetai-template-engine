import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1024, 1440, 1920],
  },
  // Static export for Cloudflare Pages / Vercel
  // output: "export",
  // trailingSlash: true,
}

export default nextConfig
