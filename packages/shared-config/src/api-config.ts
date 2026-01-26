/**
 * Shared API Configuration for all T.O.O.L.S Inc Portals
 */

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Production
  if (typeof window !== 'undefined' && window.location.hostname.includes('sdtoolsinc.org')) {
    return 'https://api.sdtoolsinc.org'
  }
  
  // Staging
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.sdtoolsinc.org'
  }
  
  // Local development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7071'
}

export const API_BASE_URL = getApiBaseUrl()

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
    SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/v1/auth/verify-email`,
    SEND_VERIFICATION: `${API_BASE_URL}/api/v1/auth/send-verification`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/v1/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/v1/auth/reset-password`,
  },

  // Users
  USERS: {
    ME: `${API_BASE_URL}/api/v1/users/me`,
    LIST: `${API_BASE_URL}/api/v1/users`,
    GET: (id: string) => `${API_BASE_URL}/api/v1/users/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/users/${id}`,
  },

  // Admin
  ADMIN: {
    USERS: `${API_BASE_URL}/api/v1/admin/users`,
    ASSIGNMENTS: `${API_BASE_URL}/api/v1/admin/assignments`,
    AUDIT: `${API_BASE_URL}/api/v1/admin/audit`,
    ROLES: `${API_BASE_URL}/api/v1/admin/roles`,
    REPORTS: `${API_BASE_URL}/api/v1/admin/reports`,
  },

  // Clients
  CLIENTS: {
    LIST: `${API_BASE_URL}/api/v1/clients`,
    GET: (id: string) => `${API_BASE_URL}/api/v1/clients/${id}`,
    CREATE: `${API_BASE_URL}/api/v1/clients`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/clients/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/clients/${id}`,
    NOTES: (id: string) => `${API_BASE_URL}/api/v1/clients/${id}/notes`,
    DOCUMENTS: (id: string) => `${API_BASE_URL}/api/v1/clients/${id}/documents`,
  },

  // Case Managers
  CASE_MANAGERS: {
    LIST: `${API_BASE_URL}/api/v1/case-managers`,
    GET: (id: string) => `${API_BASE_URL}/api/v1/case-managers/${id}`,
    CLIENTS: (id: string) => `${API_BASE_URL}/api/v1/case-managers/${id}/clients`,
    PERFORMANCE: (id: string) => `${API_BASE_URL}/api/v1/case-managers/${id}/performance`,
  },

  // Courses
  COURSES: {
    LIST: `${API_BASE_URL}/api/v1/courses`,
    GET: (id: string) => `${API_BASE_URL}/api/v1/courses/${id}`,
    ENROLL: (id: string) => `${API_BASE_URL}/api/v1/courses/${id}/enroll`,
    PROGRESS: (id: string) => `${API_BASE_URL}/api/v1/courses/${id}/progress`,
  },

  // Journal
  JOURNAL: {
    LIST: `${API_BASE_URL}/api/v1/journal`,
    GET: (id: string) => `${API_BASE_URL}/api/v1/journal/${id}`,
    CREATE: `${API_BASE_URL}/api/v1/journal`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/journal/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/journal/${id}`,
  },
}

/**
 * API Request Headers
 */
/**
 * API Request Headers
 */
export const getApiHeaders = (includeAuth = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (includeAuth && typeof window !== 'undefined') {
    // Import AUTH_TOKEN_KEY from env at runtime to avoid circular dependency
    const AUTH_TOKEN_KEY = 'auth_token'
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * API Fetch Wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...getApiHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json()
}
