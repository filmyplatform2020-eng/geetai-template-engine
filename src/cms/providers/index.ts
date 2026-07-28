import type { ProductProvider, ProviderId } from "@/cms/types"
import { LocalProvider } from "./local"

const providerRegistry: Map<ProviderId, () => ProductProvider> = new Map([
  ["local", () => new LocalProvider()],
])

export function registerProvider(id: ProviderId, factory: () => ProductProvider): void {
  providerRegistry.set(id, factory)
}

export function createProvider(id: ProviderId): ProductProvider {
  const factory = providerRegistry.get(id)
  if (!factory) {
    console.warn(`Provider "${id}" not registered. Falling back to local.`)
    return new LocalProvider()
  }
  return factory()
}

export { LocalProvider }
