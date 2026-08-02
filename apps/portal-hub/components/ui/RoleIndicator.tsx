'use client'

export function RoleIndicator({ roles }: { roles: string[] }) {
  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    case_manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    client: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    auditor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  }

  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    case_manager: 'Case Manager',
    client: 'Client',
    auditor: 'Auditor',
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {roles.map((role) => (
        <span
          key={role}
          className={`px-4 py-2 rounded-full text-sm font-semibold border ${
            roleColors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }`}
        >
          {roleNames[role] || role}
        </span>
      ))}
    </div>
  )
}
