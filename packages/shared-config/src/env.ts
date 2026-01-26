/**
 * Shared Environment Configuration
 */

export const ENV = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.sdtoolsinc.org',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),

  // Authentication
  AUTH_COOKIE_NAME: 'toolsinc_session',
  AUTH_TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',

  // OAuth Providers
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
  AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,

  // Email Service
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'azure', // 'azure' | 'sendgrid'
  AZURE_COMMUNICATION_CONNECTION_STRING: process.env.AZURE_COMMUNICATION_CONNECTION_STRING,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@sdtoolsinc.org',

  // Database
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,

  // Feature Flags (default to true unless explicitly set to 'false')
  ENABLE_RBAC: process.env.ENABLE_RBAC !== 'false',
  ENABLE_AUDIT_LOGGING: process.env.ENABLE_AUDIT_LOGGING !== 'false',
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_STAGING: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
} as const

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = [
    'NEXTAUTH_SECRET',
    'DB_CONNECTION_STRING',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
