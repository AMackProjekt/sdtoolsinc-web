import { AlertCircle, Lock } from "lucide-react";
import type { CoreRole, EnterpriseRole } from "@/lib/authz";
import { ENTERPRISE_ROLE_CONFIG, getAccessDeniedMessage } from "@/lib/enterprise-rbac";

interface EnterpriseAccessGuardProps {
  suite: keyof typeof ENTERPRISE_ROLE_CONFIG;
  userRole: CoreRole;
  enterpriseRoles?: EnterpriseRole[];
  children: React.ReactNode;
}

/**
 * Client-side access guard component.
 * Shows content if user has required role, otherwise shows access denied message.
 */
export function EnterpriseAccessGuard({
  suite,
  userRole,
  enterpriseRoles = [],
  children,
}: EnterpriseAccessGuardProps) {
  const config = ENTERPRISE_ROLE_CONFIG[suite];

  // Admin always has access
  if (userRole === "admin") {
    return <>{children}</>;
  }

  // Check if user has required enterprise role or fallback role
  const allRoles = [userRole, ...enterpriseRoles] as (CoreRole | EnterpriseRole)[];
  const hasAccess = allRoles.some(
    (r) =>
      config.requiredRoles.includes(r as EnterpriseRole) || config.fallbackRoles.includes(r)
  );

  if (!hasAccess) {
    return <AccessDeniedView suite={suite} message={getAccessDeniedMessage(suite)} />;
  }

  return <>{children}</>;
}

/**
 * Access denied UI component shown when user lacks required role.
 */
export function AccessDeniedView({
  suite,
  message,
}: {
  suite: keyof typeof ENTERPRISE_ROLE_CONFIG;
  message: string;
}) {
  const config = ENTERPRISE_ROLE_CONFIG[suite];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Lock icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>

        {/* Suite name */}
        <p className="text-sm text-slate-500 mb-4">{config.label}</p>

        {/* Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{message}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-6">
          {config.description}
        </p>

        {/* Contact info */}
        <div className="text-xs text-slate-500">
          <p className="mb-2">Contact your administrator if you believe this is an error.</p>
          <p className="text-slate-400">Required role(s): {config.requiredRoles.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
