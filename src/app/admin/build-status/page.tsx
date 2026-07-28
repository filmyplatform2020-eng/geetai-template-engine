export default function BuildStatusPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Build Status</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Build</p>
          <p className="mt-2 text-lg font-semibold text-emerald-400">Passing</p>
          <p className="mt-1 text-xs text-white/40">Last build: clean</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">TypeScript</p>
          <p className="mt-2 text-lg font-semibold text-emerald-400">Clean</p>
          <p className="mt-1 text-xs text-white/40">0 errors</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Tests</p>
          <p className="mt-2 text-lg font-semibold text-emerald-400">14 passing</p>
          <p className="mt-1 text-xs text-white/40">4 test files</p>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-white/40">CI Pipeline</p>
        <p className="mt-2 text-sm text-white/50">
          GitHub Actions: lint → typecheck → tests → build → Playwright E2E → a11y
        </p>
      </div>
    </div>
  )
}
