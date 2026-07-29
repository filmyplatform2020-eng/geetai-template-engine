import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#06060e] px-4">
      <div className="text-center">
        <div className="mb-6 text-6xl font-bold text-white/10">404</div>
        <h1 className="mb-3 text-2xl font-semibold text-white/80">Page Not Found</h1>
        <p className="mb-8 text-sm text-white/40">
          This product may have been moved, renamed, or removed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/15"
          >
            Browse Reviews
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white/5 px-6 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-white/10"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
