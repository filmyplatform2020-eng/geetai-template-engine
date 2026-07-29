import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, readdirSync } from "fs"
import { join } from "path"

const BACKUPS_DIR = join(process.cwd(), "src", "data", "backups")
const PRODUCTS_DIR = join(process.cwd(), "src", "data", "products")

export interface BackupManifest {
  id: string
  timestamp: string
  products: string[]
  registry: boolean
  size: number
}

export function createFullBackup(): BackupManifest {
  if (!existsSync(BACKUPS_DIR)) mkdirSync(BACKUPS_DIR, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const id = `backup-${timestamp}`
  const backupDir = join(BACKUPS_DIR, id)
  mkdirSync(backupDir, { recursive: true })

  // Backup all product files
  const productFiles = readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts")
  for (const file of productFiles) {
    copyFileSync(join(PRODUCTS_DIR, file), join(backupDir, file))
  }

  // Backup registry
  const registryPath = join(PRODUCTS_DIR, "registry.ts")
  if (existsSync(registryPath)) {
    copyFileSync(registryPath, join(backupDir, "registry.ts"))
  }

  // Calculate size
  let totalSize = 0
  for (const file of readdirSync(backupDir)) {
    totalSize += readFileSync(join(backupDir, file)).length
  }

  const manifest: BackupManifest = {
    id,
    timestamp: new Date().toISOString(),
    products: productFiles.map((f) => f.replace(".ts", "")),
    registry: true,
    size: totalSize,
  }

  writeFileSync(join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2))

  // Prune old backups (keep last 20)
  pruneBackups(20)

  return manifest
}

export function getBackups(): BackupManifest[] {
  if (!existsSync(BACKUPS_DIR)) return []
  return readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith("backup-"))
    .map((dir) => {
      const manifestPath = join(BACKUPS_DIR, dir, "manifest.json")
      try {
        return JSON.parse(readFileSync(manifestPath, "utf-8"))
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function pruneBackups(keep: number): void {
  const backups = getBackups()
  if (backups.length <= keep) return
  for (const backup of backups.slice(keep)) {
    const dir = join(BACKUPS_DIR, backup.id)
    try {
      const files = readdirSync(dir)
      for (const file of files) {
        try {
          const fullPath = join(dir, file)
          // Use fs.rm to remove files
          const fs = require("fs")
          fs.rmSync(fullPath, { force: true })
        } catch {}
      }
      const fs = require("fs")
      fs.rmSync(dir, { force: true, recursive: true })
    } catch {}
  }
}
