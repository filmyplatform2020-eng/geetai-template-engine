import { randomBytes, pbkdf2Sync } from "crypto"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { createInterface } from "readline"

const __dirname = dirname(fileURLToPath(import.meta.url))
const USERS_PATH = join(__dirname, "..", "src", "data", "auth", "users.json")

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
  return { hash, salt }
}

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const q = (query) => new Promise((resolve) => rl.question(query, resolve))

  console.log("Initialize Admin Users\n")
  const users = {}

  const adminPass = await q("Admin password [default: admin123]: ") || "admin123"
  const editorPass = await q("Editor password [default: editor123]: ") || "editor123"
  const reviewerPass = await q("Reviewer password [default: reviewer123]: ") || "reviewer123"

  const adminH = hashPassword(adminPass)
  users.admin = { password: adminH.hash, salt: adminH.salt, role: "admin", name: "Admin User" }

  const editorH = hashPassword(editorPass)
  users.editor = { password: editorH.hash, salt: editorH.salt, role: "editor", name: "Editor User" }

  const reviewerH = hashPassword(reviewerPass)
  users.reviewer = { password: reviewerH.hash, salt: reviewerH.salt, role: "reviewer", name: "Reviewer User" }

  const dir = dirname(USERS_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(USERS_PATH, JSON.stringify(users, null, 2))

  console.log("\nUsers created:")
  console.log("  admin    → admin password")
  console.log("  editor   → editor password")
  console.log("  reviewer → reviewer password")
  console.log(`\nSaved to ${USERS_PATH}`)

  rl.close()
}

main()
