import { execSync } from "child_process"

export interface PublishResult {
  success: boolean
  buildOutput: string
  pages?: string[]
  error?: string
}

export function runBuild(): PublishResult {
  try {
    const output = execSync("npm run build 2>&1", {
      encoding: "utf-8",
      timeout: 300_000,
    })

    const pages: string[] = []
    for (const line of output.split("\n")) {
      const match = line.match(/●\s+\/(review|guide)\/([\w-]+)/)
      if (match) {
        pages.push(`/${match[1]}/${match[2]}`)
      }
    }

    return { success: true, buildOutput: truncateOutput(output), pages }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { success: false, buildOutput: truncateOutput(msg), error: `Build failed: ${msg}` }
  }
}

function truncateOutput(text: string, max = 3000): string {
  if (text.length <= max) return text
  return text.slice(0, max) + "\n... (truncated)"
}
