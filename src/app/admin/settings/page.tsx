"use client"

import { useState } from "react"

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("GeetAI Reviews")
  const [baseUrl, setBaseUrl] = useState("https://geetai.com")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Settings</h1>
      <div className="max-w-xl space-y-5">
        <div>
          <label className="mb-1 block text-xs text-white/50">Site Name</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Base URL</label>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">CMS Provider</label>
          <input value="Local TypeScript (src/data/products/)" disabled
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/30 outline-none" />
          <p className="mt-1 text-[10px] text-white/30">Change provider in src/cms/config.ts</p>
        </div>
        <button onClick={handleSave}
          className="rounded-lg bg-white/10 px-6 py-2 text-sm text-white/80 hover:bg-white/20 transition-colors">
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
