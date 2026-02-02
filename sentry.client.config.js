/**
 * Sentry Client Configuration
 * Captures errors in the browser
 */
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Session Replay (disabled for v1.0.0)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    
    // Filter out noise
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random network errors
      'ResizeObserver loop limit exceeded',
      // User cancelled payment (expected)
      'Payment window was closed',
    ],
    
    // Add context
    beforeSend(event, hint) {
      // Don't send in development (unless explicitly enabled)
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
        console.log('🚨 [Sentry Debug] Would send error:', event)
        return null
      }
      
      return event
    },
  })
}
