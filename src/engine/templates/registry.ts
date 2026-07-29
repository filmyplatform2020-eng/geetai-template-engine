export type EngineStatus = "active" | "inactive" | "error"

export interface EngineRegistration {
  name: string
  version: string
  capabilities: string[]
  dependencies: string[]
  status: EngineStatus
}

export interface EngineHealthReport {
  name: string
  status: EngineStatus
  uptime: number
  lastActivity: number
  error?: string
}

class EngineRegistry {
  private engines = new Map<string, EngineRegistration>()
  private created = Date.now()
  private lastActivity = Date.now()

  register(engine: EngineRegistration): void {
    this.engines.set(engine.name, engine)
    this.lastActivity = Date.now()
  }

  get(name: string): EngineRegistration | undefined {
    return this.engines.get(name)
  }

  getAll(): EngineRegistration[] {
    return Array.from(this.engines.values())
  }

  health(): EngineHealthReport[] {
    const now = Date.now()
    return Array.from(this.engines.entries()).map(([name, reg]) => ({
      name,
      status: reg.status,
      uptime: now - this.created,
      lastActivity: now - this.lastActivity,
    }))
  }

  has(name: string): boolean {
    return this.engines.has(name)
  }

  count(): number {
    return this.engines.size
  }
}

export const engineRegistry = new EngineRegistry()
