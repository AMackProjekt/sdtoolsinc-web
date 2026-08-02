/**
 * TypeScript type definitions for Portal Hub
 */

export interface User {
  id?: string
  name?: string
  email: string
  roles: string[]
  stats?: UserStats
}

export interface UserStats {
  activeClients?: number
  completedTasks?: number
  hoursLogged?: number
}

export interface Portal {
  id: string
  name: string
  description: string
  url: string
  icon: string
  color: string
  gradient: string
  requiredRoles: string[]
  badge?: string
}
