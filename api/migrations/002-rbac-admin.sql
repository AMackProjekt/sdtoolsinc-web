-- T.O.O.L.S Inc Admin Portal RBAC Migration
-- Azure SQL Database - Role-Based Access Control & Admin Features

-- ============================================================================
-- RBAC TABLES
-- ============================================================================

-- Roles table
CREATE TABLE Roles (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name NVARCHAR(50) UNIQUE NOT NULL,
  Description NVARCHAR(255),
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Permissions table
CREATE TABLE Permissions (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name NVARCHAR(100) UNIQUE NOT NULL,
  Resource NVARCHAR(50) NOT NULL, -- 'users', 'clients', 'case_managers', 'audit', etc.
  Action NVARCHAR(50) NOT NULL,   -- 'create', 'read', 'update', 'delete', 'assign'
  Description NVARCHAR(255),
  CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Role Permissions junction table
CREATE TABLE RolePermissions (
  RoleId UNIQUEIDENTIFIER NOT NULL,
  PermissionId UNIQUEIDENTIFIER NOT NULL,
  PRIMARY KEY (RoleId, PermissionId),
  FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
  FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE
);

-- User Roles table (users can have multiple roles)
CREATE TABLE UserRoles (
  UserId UNIQUEIDENTIFIER NOT NULL,
  RoleId UNIQUEIDENTIFIER NOT NULL,
  AssignedBy UNIQUEIDENTIFIER,
  AssignedAt DATETIME2 DEFAULT GETDATE(),
  PRIMARY KEY (UserId, RoleId),
  FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
  FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
  FOREIGN KEY (AssignedBy) REFERENCES Users(Id)
);

-- ============================================================================
-- UPDATE USERS TABLE
-- ============================================================================

-- Add new columns to Users table if they don't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'LastLoginAt')
  ALTER TABLE Users ADD LastLoginAt DATETIME2;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'CreatedBy')
  ALTER TABLE Users ADD CreatedBy UNIQUEIDENTIFIER;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'CreatedBy')
  ALTER TABLE Users ADD CONSTRAINT FK_Users_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id);

-- Update Role column default if it exists, otherwise it should already be in schema.sql
-- Note: Users.Role, Users.IsActive already exist in base schema.sql

-- ============================================================================
-- CLIENT ASSIGNMENTS
-- ============================================================================

-- Client Case Manager Assignments
CREATE TABLE ClientAssignments (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  ClientId UNIQUEIDENTIFIER NOT NULL,
  CaseManagerId UNIQUEIDENTIFIER NOT NULL,
  AssignedBy UNIQUEIDENTIFIER NOT NULL,
  AssignedAt DATETIME2 DEFAULT GETDATE(),
  Status NVARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'transferred'
  Notes NVARCHAR(MAX),
  FOREIGN KEY (ClientId) REFERENCES Users(Id),
  FOREIGN KEY (CaseManagerId) REFERENCES Users(Id),
  FOREIGN KEY (AssignedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_ClientAssignments_ClientId ON ClientAssignments(ClientId);
CREATE INDEX IX_ClientAssignments_CaseManagerId ON ClientAssignments(CaseManagerId);
CREATE INDEX IX_ClientAssignments_Status ON ClientAssignments(Status);

-- ============================================================================
-- ENHANCED AUDIT LOG
-- ============================================================================

-- Enhanced Audit Log
CREATE TABLE AuditLog (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  UserId UNIQUEIDENTIFIER,
  UserRole NVARCHAR(20),
  Action NVARCHAR(100) NOT NULL,
  Resource NVARCHAR(50) NOT NULL,
  ResourceId UNIQUEIDENTIFIER,
  Details NVARCHAR(MAX), -- JSON with before/after states
  IpAddress NVARCHAR(45),
  UserAgent NVARCHAR(500),
  Success BIT DEFAULT 1,
  ErrorMessage NVARCHAR(MAX),
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IX_AuditLog_UserId ON AuditLog(UserId);
CREATE INDEX IX_AuditLog_Resource ON AuditLog(Resource);
CREATE INDEX IX_AuditLog_CreatedAt ON AuditLog(CreatedAt DESC);
CREATE INDEX IX_AuditLog_Action ON AuditLog(Action);
CREATE INDEX IX_AuditLog_Success ON AuditLog(Success);

-- ============================================================================
-- DEFAULT ROLES
-- ============================================================================

-- Insert default roles
INSERT INTO Roles (Name, Description) VALUES
  ('admin', 'Full system administrator with all permissions'),
  ('case_manager', 'Case manager with client management permissions'),
  ('client', 'End user client with limited permissions'),
  ('auditor', 'Read-only access to audit logs and reports');

-- ============================================================================
-- DEFAULT PERMISSIONS
-- ============================================================================

-- Insert default permissions
INSERT INTO Permissions (Name, Resource, Action, Description) VALUES
  -- User management
  ('users.create', 'users', 'create', 'Create new users'),
  ('users.read', 'users', 'read', 'View user information'),
  ('users.update', 'users', 'update', 'Update user information'),
  ('users.delete', 'users', 'delete', 'Delete users'),
  ('users.assign_role', 'users', 'assign', 'Assign roles to users'),
  
  -- Client management
  ('clients.create', 'clients', 'create', 'Create new clients'),
  ('clients.read', 'clients', 'read', 'View client information'),
  ('clients.update', 'clients', 'update', 'Update client information'),
  ('clients.delete', 'clients', 'delete', 'Delete clients'),
  ('clients.assign', 'clients', 'assign', 'Assign clients to case managers'),
  
  -- Case manager management
  ('case_managers.create', 'case_managers', 'create', 'Create case managers'),
  ('case_managers.read', 'case_managers', 'read', 'View case manager information'),
  ('case_managers.update', 'case_managers', 'update', 'Update case manager information'),
  ('case_managers.delete', 'case_managers', 'delete', 'Delete case managers'),
  
  -- Audit
  ('audit.read', 'audit', 'read', 'View audit logs'),
  ('audit.export', 'audit', 'export', 'Export audit logs'),
  ('audit.delete', 'audit', 'delete', 'Delete audit logs'),
  
  -- Reports
  ('reports.view', 'reports', 'read', 'View reports'),
  ('reports.export', 'reports', 'export', 'Export reports'),
  
  -- Settings
  ('settings.read', 'settings', 'read', 'View system settings'),
  ('settings.update', 'settings', 'update', 'Update system settings'),
  ('roles.manage', 'roles', 'manage', 'Manage roles and permissions');

-- ============================================================================
-- ROLE-PERMISSION ASSIGNMENTS
-- ============================================================================

-- Assign all permissions to admin role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Name = 'admin';

-- Assign limited permissions to case_manager role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Name = 'case_manager'
  AND p.Name IN (
    'clients.read', 'clients.update',
    'reports.view', 'audit.read'
  );

-- Assign minimal permissions to client role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Name = 'client'
  AND p.Name IN ('clients.read');

-- Assign auditor permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.Name = 'auditor'
  AND p.Name IN ('audit.read', 'audit.export', 'reports.view', 'reports.export');

-- ============================================================================
-- COMPLETED
-- ============================================================================
