const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = API_BASE + endpoint
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error?.message || 'API request failed')
  }

  return res.json()
}

export const api = {
  // Users
  getCurrentUser: () => fetchAPI('/v1/users/me'),
  updateProfile: (data: any) => fetchAPI('/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Progress tracking
  getProgress: () => fetchAPI('/v1/progress'),
  updateProgress: (data: any) => fetchAPI('/v1/progress', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
