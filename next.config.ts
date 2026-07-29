import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1024, 1440, 1920],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
}

export default nextConfig
