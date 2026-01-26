import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";
import { query } from "../../shared/database";
import { hasPermission, hasRole } from "../../shared/rbac";
import { logSuccess, logFailure } from "../../shared/audit";

interface User {
  Id: string;
  Email: string;
  DisplayName: string;
  EntraId: string;
  IsActive: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface AuditLogEntry {
  Id: string;
  UserId?: string;
  UserRole?: string;
  Action: string;
  Resource: string;
  ResourceId?: string;
  Details?: string;
  IpAddress?: string;
  UserAgent?: string;
  Success: boolean;
  ErrorMessage?: string;
  CreatedAt: Date;
}

interface DashboardStats {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    byRole: Array<{ role: string; count: number }>;
  };
  assignmentStats: {
    totalAssignments: number;
    activeAssignments: number;
    inactiveAssignments: number;
    transferredAssignments: number;
  };
  recentActivity: AuditLogEntry[];
}

interface UserActivityReport {
  userId: string;
  displayName: string;
  email: string;
  totalLogins: number;
  lastLogin?: Date;
  totalActions: number;
  actionsByType: Array<{ action: string; count: number }>;
}

interface AssignmentReport {
  caseManagerId?: string;
  caseManagerName?: string;
  statusDistribution: Array<{ status: string; count: number }>;
  totalAssignments: number;
  byMonth: Array<{ month: string; count: number }>;
}

interface CaseManagerPerformance {
  caseManagerId: string;
  caseManagerName: string;
  caseManagerEmail: string;
  activeCaseload: number;
  totalCaseload: number;
  totalActions: number;
  recentActivity: number;
  assignmentRate: number;
}

/**
 * Get authenticated user from Azure SWA
 */
function getAuthenticatedUser(req: HttpRequest): { userId: string; entraId: string; email: string } | null {
  const clientPrincipal = req.headers.get('x-ms-client-principal');
  
  if (!clientPrincipal) {
    return null;
  }

  try {
    const principal = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
    return {
      userId: principal.userId,
      entraId: principal.userId,
      email: principal.userDetails
    };
  } catch {
    return null;
  }
}

/**
 * Get admin user ID from database
 */
async function getAdminUserId(entraId: string): Promise<string | null> {
  const users = await query<User>(
    "SELECT Id FROM Users WHERE EntraId = @entraId",
    { entraId }
  );
  return users.length > 0 ? users[0].Id : null;
}

/**
 * Parse date range from query params
 */
function parseDateRange(req: HttpRequest): { startDate?: Date; endDate?: Date } {
  const url = new URL(req.url);
  const startDateParam = url.searchParams.get('startDate');
  const endDateParam = url.searchParams.get('endDate');
  
  let startDate: Date | undefined;
  let endDate: Date | undefined;
  
  if (startDateParam) {
    startDate = new Date(startDateParam);
    if (isNaN(startDate.getTime())) {
      startDate = undefined;
    }
  }
  
  if (endDateParam) {
    endDate = new Date(endDateParam);
    if (isNaN(endDate.getTime())) {
      endDate = undefined;
    }
  }
  
  return { startDate, endDate };
}

/**
 * GET /api/v1/admin/reports/dashboard - Dashboard statistics
 */
async function getDashboardReport(
  req: HttpRequest, 
  adminUserId: string, 
  ipAddress?: string, 
  userAgent?: string
): Promise<HttpResponseInit> {
  try {
    // Get user statistics
    const userCountResults = await query<{ Total: number; Active: number; Inactive: number }>(
      `SELECT 
        COUNT(*) as Total,
        SUM(CASE WHEN IsActive = 1 THEN 1 ELSE 0 END) as Active,
        SUM(CASE WHEN IsActive = 0 THEN 1 ELSE 0 END) as Inactive
       FROM Users`
    );
    
    const userCounts = userCountResults[0] || { Total: 0, Active: 0, Inactive: 0 };

    // Get user counts by role
    const usersByRole = await query<{ role: string; count: number }>(
      `SELECT 
        COALESCE(r.Name, 'no_role') as role,
        COUNT(DISTINCT u.Id) as count
       FROM Users u
       LEFT JOIN UserRoles ur ON u.Id = ur.UserId
       LEFT JOIN Roles r ON ur.RoleId = r.Id
       GROUP BY r.Name`
    );

    // Get assignment statistics
    const assignmentStats = await query<{ 
      Total: number; 
      Active: number; 
      Inactive: number; 
      Transferred: number 
    }>(
      `SELECT 
        COUNT(*) as Total,
        SUM(CASE WHEN Status = 'active' THEN 1 ELSE 0 END) as Active,
        SUM(CASE WHEN Status = 'inactive' THEN 1 ELSE 0 END) as Inactive,
        SUM(CASE WHEN Status = 'transferred' THEN 1 ELSE 0 END) as Transferred
       FROM ClientAssignments`
    );
    
    const assignmentCounts = assignmentStats[0] || { 
      Total: 0, 
      Active: 0, 
      Inactive: 0, 
      Transferred: 0 
    };

    // Get recent activity (last 10 audit entries)
    const recentActivity = await query<AuditLogEntry>(
      `SELECT TOP 10 
        al.*,
        u.DisplayName as UserDisplayName,
        u.Email as UserEmail
       FROM AuditLog al
       LEFT JOIN Users u ON al.UserId = u.Id
       ORDER BY al.CreatedAt DESC`
    );

    const dashboardStats: DashboardStats = {
      userStats: {
        totalUsers: userCounts.Total,
        activeUsers: userCounts.Active,
        inactiveUsers: userCounts.Inactive,
        byRole: usersByRole
      },
      assignmentStats: {
        totalAssignments: assignmentCounts.Total,
        activeAssignments: assignmentCounts.Active,
        inactiveAssignments: assignmentCounts.Inactive,
        transferredAssignments: assignmentCounts.Transferred
      },
      recentActivity
    };

    await logSuccess(adminUserId, 'admin', 'view_dashboard_report', 'reports', undefined,
      undefined, ipAddress, userAgent);

    return ok(dashboardStats);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'view_dashboard_report', 'reports',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/reports/users - User activity reports
 */
async function getUserActivityReport(
  req: HttpRequest,
  adminUserId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const { startDate, endDate } = parseDateRange(req);
    
    let sql = `
      SELECT 
        u.Id as userId,
        u.DisplayName as displayName,
        u.Email as email,
        (SELECT COUNT(*) 
         FROM AuditLog al 
         WHERE al.UserId = u.Id 
           AND al.Action = 'login'
           AND al.Success = 1
           ${startDate ? 'AND al.CreatedAt >= @startDate' : ''}
           ${endDate ? 'AND al.CreatedAt <= @endDate' : ''}
        ) as totalLogins,
        (SELECT MAX(al.CreatedAt)
         FROM AuditLog al
         WHERE al.UserId = u.Id 
           AND al.Action = 'login'
           AND al.Success = 1
        ) as lastLogin,
        (SELECT COUNT(*)
         FROM AuditLog al
         WHERE al.UserId = u.Id
           ${startDate ? 'AND al.CreatedAt >= @startDate' : ''}
           ${endDate ? 'AND al.CreatedAt <= @endDate' : ''}
        ) as totalActions
      FROM Users u
      WHERE 1=1
    `;
    
    const params: Record<string, any> = {};
    
    if (userId) {
      sql += ' AND u.Id = @userId';
      params.userId = userId;
    }
    
    if (startDate) {
      params.startDate = startDate;
    }
    
    if (endDate) {
      params.endDate = endDate;
    }
    
    sql += ' ORDER BY totalActions DESC';
    
    const userActivity = await query<UserActivityReport>(sql, params);
    
    // Get action breakdown for each user
    for (const user of userActivity) {
      let actionSql = `
        SELECT 
          al.Action as action,
          COUNT(*) as count
        FROM AuditLog al
        WHERE al.UserId = @userId
      `;
      
      const actionParams: Record<string, any> = { userId: user.userId };
      
      if (startDate) {
        actionSql += ' AND al.CreatedAt >= @startDate';
        actionParams.startDate = startDate;
      }
      
      if (endDate) {
        actionSql += ' AND al.CreatedAt <= @endDate';
        actionParams.endDate = endDate;
      }
      
      actionSql += ' GROUP BY al.Action ORDER BY count DESC';
      
      user.actionsByType = await query<{ action: string; count: number }>(actionSql, actionParams);
    }

    await logSuccess(adminUserId, 'admin', 'view_user_activity_report', 'reports', undefined,
      { userId, startDate, endDate }, ipAddress, userAgent);

    return ok({
      data: userActivity,
      filters: { userId, startDate, endDate }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'view_user_activity_report', 'reports',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/reports/assignments - Assignment reports
 */
async function getAssignmentReport(
  req: HttpRequest,
  adminUserId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const caseManagerId = url.searchParams.get('caseManagerId');
    const { startDate, endDate } = parseDateRange(req);
    
    // Get status distribution
    let statusSql = `
      SELECT 
        Status as status,
        COUNT(*) as count
      FROM ClientAssignments
      WHERE 1=1
    `;
    
    const params: Record<string, any> = {};
    
    if (caseManagerId) {
      statusSql += ' AND CaseManagerId = @caseManagerId';
      params.caseManagerId = caseManagerId;
    }
    
    if (startDate) {
      statusSql += ' AND AssignedAt >= @startDate';
      params.startDate = startDate;
    }
    
    if (endDate) {
      statusSql += ' AND AssignedAt <= @endDate';
      params.endDate = endDate;
    }
    
    statusSql += ' GROUP BY Status ORDER BY count DESC';
    
    const statusDistribution = await query<{ status: string; count: number }>(statusSql, params);
    
    // Get total assignments
    let countSql = `
      SELECT COUNT(*) as total
      FROM ClientAssignments
      WHERE 1=1
    `;
    
    if (caseManagerId) {
      countSql += ' AND CaseManagerId = @caseManagerId';
    }
    
    if (startDate) {
      countSql += ' AND AssignedAt >= @startDate';
    }
    
    if (endDate) {
      countSql += ' AND AssignedAt <= @endDate';
    }
    
    const totalResult = await query<{ total: number }>(countSql, params);
    const totalAssignments = totalResult[0]?.total || 0;
    
    // Get assignments by month
    let monthSql = `
      SELECT 
        FORMAT(AssignedAt, 'yyyy-MM') as month,
        COUNT(*) as count
      FROM ClientAssignments
      WHERE 1=1
    `;
    
    if (caseManagerId) {
      monthSql += ' AND CaseManagerId = @caseManagerId';
    }
    
    if (startDate) {
      monthSql += ' AND AssignedAt >= @startDate';
    }
    
    if (endDate) {
      monthSql += ' AND AssignedAt <= @endDate';
    }
    
    monthSql += ' GROUP BY FORMAT(AssignedAt, \'yyyy-MM\') ORDER BY month DESC';
    
    const byMonth = await query<{ month: string; count: number }>(monthSql, params);
    
    // Get case manager info if filtered by case manager
    let caseManagerName: string | undefined;
    if (caseManagerId) {
      const cmResult = await query<{ DisplayName: string }>(
        'SELECT DisplayName FROM Users WHERE Id = @caseManagerId',
        { caseManagerId }
      );
      caseManagerName = cmResult[0]?.DisplayName;
    }
    
    const report: AssignmentReport = {
      caseManagerId: caseManagerId || undefined,
      caseManagerName,
      statusDistribution,
      totalAssignments,
      byMonth
    };

    await logSuccess(adminUserId, 'admin', 'view_assignment_report', 'reports', undefined,
      { caseManagerId, startDate, endDate }, ipAddress, userAgent);

    return ok(report);
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'view_assignment_report', 'reports',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * GET /api/v1/admin/reports/case-managers - Case manager performance
 */
async function getCaseManagerPerformance(
  req: HttpRequest,
  adminUserId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<HttpResponseInit> {
  try {
    const { startDate, endDate } = parseDateRange(req);
    
    // Get all case managers
    const caseManagers = await query<{ Id: string; DisplayName: string; Email: string }>(
      `SELECT DISTINCT u.Id, u.DisplayName, u.Email
       FROM Users u
       INNER JOIN UserRoles ur ON u.Id = ur.UserId
       INNER JOIN Roles r ON ur.RoleId = r.Id
       WHERE r.Name IN ('case_manager', 'admin')
         AND u.IsActive = 1
       ORDER BY u.DisplayName`
    );
    
    const performanceData: CaseManagerPerformance[] = [];
    
    for (const cm of caseManagers) {
      // Get active caseload
      const activeCaseload = await query<{ count: number }>(
        `SELECT COUNT(*) as count
         FROM ClientAssignments
         WHERE CaseManagerId = @caseManagerId AND Status = 'active'`,
        { caseManagerId: cm.Id }
      );
      
      // Get total caseload
      const totalCaseload = await query<{ count: number }>(
        `SELECT COUNT(*) as count
         FROM ClientAssignments
         WHERE CaseManagerId = @caseManagerId`,
        { caseManagerId: cm.Id }
      );
      
      // Get total actions
      let actionSql = `
        SELECT COUNT(*) as count
        FROM AuditLog
        WHERE UserId = @caseManagerId
      `;
      
      const actionParams: Record<string, any> = { caseManagerId: cm.Id };
      
      if (startDate) {
        actionSql += ' AND CreatedAt >= @startDate';
        actionParams.startDate = startDate;
      }
      
      if (endDate) {
        actionSql += ' AND CreatedAt <= @endDate';
        actionParams.endDate = endDate;
      }
      
      const totalActions = await query<{ count: number }>(actionSql, actionParams);
      
      // Get recent activity (last 30 days)
      const recentActivity = await query<{ count: number }>(
        `SELECT COUNT(*) as count
         FROM AuditLog
         WHERE UserId = @caseManagerId
           AND CreatedAt >= DATEADD(day, -30, GETUTCDATE())`,
        { caseManagerId: cm.Id }
      );
      
      // Calculate assignment rate (assignments per month)
      const assignmentRate = await query<{ rate: number }>(
        `SELECT 
          CASE 
            WHEN DATEDIFF(month, MIN(AssignedAt), GETUTCDATE()) > 0
            THEN CAST(COUNT(*) AS FLOAT) / DATEDIFF(month, MIN(AssignedAt), GETUTCDATE())
            ELSE COUNT(*) 
          END as rate
         FROM ClientAssignments
         WHERE CaseManagerId = @caseManagerId`,
        { caseManagerId: cm.Id }
      );
      
      performanceData.push({
        caseManagerId: cm.Id,
        caseManagerName: cm.DisplayName,
        caseManagerEmail: cm.Email,
        activeCaseload: activeCaseload[0]?.count || 0,
        totalCaseload: totalCaseload[0]?.count || 0,
        totalActions: totalActions[0]?.count || 0,
        recentActivity: recentActivity[0]?.count || 0,
        assignmentRate: assignmentRate[0]?.rate || 0
      });
    }
    
    // Sort by active caseload (descending)
    performanceData.sort((a, b) => b.activeCaseload - a.activeCaseload);

    await logSuccess(adminUserId, 'admin', 'view_case_manager_performance', 'reports', undefined,
      { startDate, endDate }, ipAddress, userAgent);

    return ok({
      data: performanceData,
      filters: { startDate, endDate }
    });
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'view_case_manager_performance', 'reports',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * Convert object array to CSV
 */
function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) {
    return headers.join(',') + '\n';
  }
  
  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '';
      }
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return headers.join(',') + '\n' + rows.join('\n');
}

/**
 * GET /api/v1/admin/reports/export - Export combined reports
 */
async function exportReports(
  req: HttpRequest,
  adminUserId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<HttpResponseInit> {
  try {
    const url = new URL(req.url);
    const reportType = url.searchParams.get('type') || 'all';
    const format = url.searchParams.get('format') || 'csv';
    const { startDate, endDate } = parseDateRange(req);
    
    if (format !== 'csv') {
      return fail("validation_error", "Only CSV format is currently supported", 422);
    }
    
    let csvData = '';
    
    if (reportType === 'users' || reportType === 'all') {
      // Export user activity
      const userReport = await getUserActivityReport(req, adminUserId, ipAddress, userAgent);
      if (userReport.status === 200) {
        const body = typeof userReport.body === 'string' 
          ? JSON.parse(userReport.body) 
          : userReport.body;
        
        csvData += '=== USER ACTIVITY REPORT ===\n';
        csvData += convertToCSV(
          body.data,
          ['userId', 'displayName', 'email', 'totalLogins', 'lastLogin', 'totalActions']
        );
        csvData += '\n\n';
      }
    }
    
    if (reportType === 'assignments' || reportType === 'all') {
      // Export assignment report
      const assignmentReport = await getAssignmentReport(req, adminUserId, ipAddress, userAgent);
      if (assignmentReport.status === 200) {
        const body = typeof assignmentReport.body === 'string'
          ? JSON.parse(assignmentReport.body)
          : assignmentReport.body;
        
        csvData += '=== ASSIGNMENT REPORT ===\n';
        csvData += 'Total Assignments,' + body.totalAssignments + '\n';
        csvData += '\nStatus Distribution:\n';
        csvData += convertToCSV(body.statusDistribution, ['status', 'count']);
        csvData += '\n\nAssignments by Month:\n';
        csvData += convertToCSV(body.byMonth, ['month', 'count']);
        csvData += '\n\n';
      }
    }
    
    if (reportType === 'case-managers' || reportType === 'all') {
      // Export case manager performance
      const cmReport = await getCaseManagerPerformance(req, adminUserId, ipAddress, userAgent);
      if (cmReport.status === 200) {
        const body = typeof cmReport.body === 'string'
          ? JSON.parse(cmReport.body)
          : cmReport.body;
        
        csvData += '=== CASE MANAGER PERFORMANCE ===\n';
        csvData += convertToCSV(
          body.data,
          ['caseManagerId', 'caseManagerName', 'caseManagerEmail', 
           'activeCaseload', 'totalCaseload', 'totalActions', 
           'recentActivity', 'assignmentRate']
        );
        csvData += '\n\n';
      }
    }

    await logSuccess(adminUserId, 'admin', 'export_reports', 'reports', undefined,
      { reportType, format, startDate, endDate }, ipAddress, userAgent);

    return {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="reports-${new Date().toISOString().split('T')[0]}.csv"`
      },
      body: csvData
    };
  } catch (error) {
    await logFailure(adminUserId, 'admin', 'export_reports', 'reports',
      error instanceof Error ? error.message : 'Unknown error',
      undefined, undefined, ipAddress, userAgent);
    throw error;
  }
}

/**
 * Main handler for admin reports endpoint
 */
export async function adminReports(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Get authenticated user
  const authUser = getAuthenticatedUser(req);
  
  if (!authUser) {
    return fail("unauthorized", "Authentication required", 401);
  }

  // Get admin user ID from database
  const adminUserId = await getAdminUserId(authUser.entraId);
  if (!adminUserId) {
    return fail("unauthorized", "User not found", 401);
  }

  // Check admin role
  const isAdmin = await hasRole(adminUserId, 'admin');
  if (!isAdmin) {
    await logFailure(adminUserId, 'user', 'admin_access_denied', 'reports',
      'Insufficient permissions', undefined, undefined,
      req.headers.get('x-forwarded-for') || undefined,
      req.headers.get('user-agent') || undefined);
    return fail("forbidden", "Admin permissions required", 403);
  }

  const method = req.method?.toUpperCase();
  const ipAddress = req.headers.get('x-forwarded-for') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    // Parse route params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    // pathParts: ['api', 'v1', 'admin', 'reports', ...rest]
    
    const reportType = pathParts[4]; // Report type after /api/v1/admin/reports/

    if (method !== "GET") {
      return fail("method_not_allowed", "Only GET method is supported", 405);
    }

    // Check permissions based on report type
    if (reportType === 'export') {
      const canExport = await hasPermission(adminUserId, 'reports.export');
      if (!canExport) {
        await logFailure(adminUserId, 'admin', 'access_denied', 'reports',
          'Missing reports.export permission', undefined, undefined, ipAddress, userAgent);
        return fail("forbidden", "reports.export permission required", 403);
      }
      return await exportReports(req, adminUserId, ipAddress, userAgent);
    }

    // Check view permission for all other reports
    const canView = await hasPermission(adminUserId, 'reports.view');
    if (!canView) {
      await logFailure(adminUserId, 'admin', 'access_denied', 'reports',
        'Missing reports.view permission', undefined, undefined, ipAddress, userAgent);
      return fail("forbidden", "reports.view permission required", 403);
    }

    switch (reportType) {
      case 'dashboard':
        return await getDashboardReport(req, adminUserId, ipAddress, userAgent);
      
      case 'users':
        return await getUserActivityReport(req, adminUserId, ipAddress, userAgent);
      
      case 'assignments':
        return await getAssignmentReport(req, adminUserId, ipAddress, userAgent);
      
      case 'case-managers':
        return await getCaseManagerPerformance(req, adminUserId, ipAddress, userAgent);
      
      default:
        return fail("not_found", "Report type not found", 404);
    }
  } catch (error) {
    context.error('Error in adminReports handler:', error);
    return fail(
      "internal_error",
      "An internal error occurred",
      500,
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

app.http("admin-reports", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "v1/admin/reports/{*restOfPath}",
  handler: adminReports
});
