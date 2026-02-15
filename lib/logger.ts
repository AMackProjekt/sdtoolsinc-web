/**
 * Structured logging utility for application-wide logging
 * Integrates with Sentry for error tracking in production
 */

import * as Sentry from '@sentry/nextjs'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  userId?: string
  email?: string
  portal?: string
  requestId?: string
  [key: string]: any
}

class Logger {
  private context: LogContext = {}

  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context }
    Sentry.setContext('custom', this.context)
  }

  clearContext() {
    this.context = {}
    Sentry.setContext('custom', {})
  }

  debug(message: string, data?: any) {
    console.debug(`[DEBUG] ${message}`, data)
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, 'debug')
    }
  }

  info(message: string, data?: any) {
    console.info(`[INFO] ${message}`, data)
    Sentry.captureMessage(message, 'info')
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data)
    Sentry.captureMessage(message, 'warning')
  }

  error(message: string, error?: Error | any, data?: any) {
    console.error(`[ERROR] ${message}`, error, data)
    
    if (error instanceof Error) {
      Sentry.captureException(error, {
        contexts: {
          error_context: { message, ...data },
        },
      })
    } else {
      Sentry.captureMessage(message, 'error')
    }
  }

  // Alias for error
  exception(error: Error, context?: any) {
    this.error(error.message, error, context)
  }

  // Track custom events
  trackEvent(event: string, data?: Record<string, any>) {
    Sentry.captureMessage(event, 'info')
    console.log(`[EVENT] ${event}`, data)
  }

  // Performance monitoring
  startTimer(label: string) {
    return {
      end: () => {
        const duration = performance.now()
        this.info(`${label} completed in ${duration.toFixed(2)}ms`)
      },
    }
  }
}

export const logger = new Logger()

/**
 * Error boundary logger for React components
 */
export function logErrorBoundary(error: Error, componentStack: string) {
  logger.error('React Error Boundary caught an error', error, {
    componentStack,
  })
}

/**
 * API error logger
 */
export function logAPIError(
  method: string,
  url: string,
  status: number,
  body?: any
) {
  logger.error(`API Error: ${method} ${url} [${status}]`, new Error(`HTTP ${status}`), {
    method,
    url,
    status,
    body,
  })
}

/**
 * Authentication event logger
 */
export function logAuthEvent(
  event: 'login' | 'signup' | 'logout' | 'password_reset',
  email?: string,
  success?: boolean
) {
  logger.info(`Auth Event: ${event}`, { email, success })
}

/**
 * Portal access logger
 */
export function logPortalAccess(portal: string, userId: string) {
  logger.info(`Portal Access: ${portal}`, { userId, portal, timestamp: new Date().toISOString() })
}
