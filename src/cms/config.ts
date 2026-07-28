import type { CMSConfig } from "@/cms/types"

export const cmsConfig: CMSConfig = {
  provider: {
    id: "local",
    name: "Local TypeScript",
  },
  cache: {
    ttl: 300_000,
    maxSize: 1000,
  },
}
