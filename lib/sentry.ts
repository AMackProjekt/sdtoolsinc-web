import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  ReplaySessionSampleRate: 0.1,
  ReplayOnErrorSampleRate: 1.0,
  
  denyUrls: [
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
  ],
})

export default Sentry
