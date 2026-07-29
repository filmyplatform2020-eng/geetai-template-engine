"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#06060e] px-4">
      <div className="text-center">
        <div className="mb-6 text-6xl font-bold text-white/10">500</div>
        <h1 className="mb-3 text-2xl font-semibold text-white/80">Something went wrong</h1>
        <p className="mb-2 text-sm text-white/40">
          An unexpected error occurred. Our team has been notified.
        </p>
        <p className="mb-8 text-xs text-white/20">
          {error.digest && <>Error ID: {error.digest}</>}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/15"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
