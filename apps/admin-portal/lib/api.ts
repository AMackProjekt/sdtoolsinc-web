const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = API_BASE + endpoint;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: 'API request failed' } }));
    throw new Error(error.error?.message || 'API request failed');
  }

  return res.json();
}

export const api = {
  // Users management
  getUsers: (params?: { role?: string; isActive?: boolean; page?: number; limit?: number }) => 
    fetchAPI(`/v1/admin/users${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
  getUser: (id: string) => fetchAPI(`/v1/admin/users/${id}`),
  createUser: (data: any) => fetchAPI('/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateUser: (id: string, data: any) => fetchAPI(`/v1/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deactivateUser: (id: string) => fetchAPI(`/v1/admin/users/${id}`, {
    method: 'DELETE',
  }),
  assignRole: (userId: string, roleId: string) => fetchAPI(`/v1/admin/users/${userId}/roles`, {
    method: 'POST',
    body: JSON.stringify({ roleId }),
  }),

  // Client assignments
  getAssignments: (params?: { caseManagerId?: string; clientId?: string }) =>
    fetchAPI(`/v1/admin/assignments${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
  createAssignment: (data: { clientId: string; caseManagerId: string; notes?: string }) =>
    fetchAPI('/v1/admin/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAssignment: (id: string, data: any) => fetchAPI(`/v1/admin/assignments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  removeAssignment: (id: string) => fetchAPI(`/v1/admin/assignments/${id}`, {
    method: 'DELETE',
  }),

  // Audit logs
  getAuditLogs: (params?: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => fetchAPI(`/v1/admin/audit${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
  getAuditLog: (id: string) => fetchAPI(`/v1/admin/audit/${id}`),
  exportAuditLogs: (format: 'csv' | 'json') => fetchAPI(`/v1/admin/audit/export?format=${format}`),

  // Roles & Permissions
  getRoles: () => fetchAPI('/v1/admin/roles'),
  getRole: (id: string) => fetchAPI(`/v1/admin/roles/${id}`),
  createRole: (data: { name: string; description: string }) => fetchAPI('/v1/admin/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRole: (id: string, data: any) => fetchAPI(`/v1/admin/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteRole: (id: string) => fetchAPI(`/v1/admin/roles/${id}`, {
    method: 'DELETE',
  }),
  addPermissionToRole: (roleId: string, permissionId: string) =>
    fetchAPI(`/v1/admin/roles/${roleId}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ permissionId }),
    }),
  removePermissionFromRole: (roleId: string, permissionId: string) =>
    fetchAPI(`/v1/admin/roles/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE',
    }),

  // Reports
  getDashboardStats: () => fetchAPI('/v1/admin/reports/dashboard'),
  getUserActivityReport: (params?: { startDate?: string; endDate?: string }) =>
    fetchAPI(`/v1/admin/reports/users${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
  getAssignmentReport: () => fetchAPI('/v1/admin/reports/assignments'),
  getCaseManagerPerformance: () => fetchAPI('/v1/admin/reports/case-managers'),
};
