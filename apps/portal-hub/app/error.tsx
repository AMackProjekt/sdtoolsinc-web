'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center glass rounded-2xl p-12 max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-text mb-2">Something went wrong!</h2>
        <p className="text-muted mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
