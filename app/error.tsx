'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Global Error]', error);
    }
    // In production, send to error tracking service
  }, [error]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-7">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      <div className="max-w-md text-center relative z-10">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-3xl font-extrabold text-text mb-3">
          Something went wrong
        </h2>
        <p className="text-muted text-lg mb-8 leading-relaxed">
          We&apos;re sorry, but we encountered an unexpected error. 
          Our team has been notified and is working to fix the issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="ghost" href="/">
            Go Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-panel rounded-lg border border-border text-left">
            <div className="text-xs font-semibold text-brand2 uppercase tracking-wider mb-2">
              Error Details (Dev Only)
            </div>
            <pre className="text-xs text-muted overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
