export interface Capability {
  name: string
  engine: string
  description: string
  version: string
}

class CapabilityRegistry {
  private capabilities = new Map<string, Capability>()

  register(capability: Capability): void {
    this.capabilities.set(capability.name, capability)
  }

  get(name: string): Capability | undefined {
    return this.capabilities.get(name)
  }

  getAll(): Capability[] {
    return Array.from(this.capabilities.values())
  }

  hasCapability(name: string): boolean {
    return this.capabilities.has(name)
  }

  getByEngine(engine: string): Capability[] {
    return Array.from(this.capabilities.values()).filter(
      (c) => c.engine === engine
    )
  }
}

export const capabilityRegistry = new CapabilityRegistry()
