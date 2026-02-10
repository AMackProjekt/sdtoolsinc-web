-- =====================================================
-- Migration: Add User Approval and Status Fields
-- Description: Adds approval workflow fields to users table
-- Date: 2026-02-10
-- =====================================================

-- Add approval fields to users table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'approved')
BEGIN
    ALTER TABLE users ADD approved BIT DEFAULT 0;
    PRINT 'Added approved column to users table';
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'approvedAt')
BEGIN
    ALTER TABLE users ADD approvedAt DATETIME2 NULL;
    PRINT 'Added approvedAt column to users table';
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'approvedBy')
BEGIN
    ALTER TABLE users ADD approvedBy VARCHAR(36) NULL;
    PRINT 'Added approvedBy column to users table';
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'status')
BEGIN
    ALTER TABLE users ADD status VARCHAR(20) DEFAULT 'pending';
    PRINT 'Added status column to users table';
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'rejectionReason')
BEGIN
    ALTER TABLE users ADD rejectionReason NVARCHAR(MAX) NULL;
    PRINT 'Added rejectionReason column to users table';
END

-- Add indexes for performance
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_users_status' AND object_id = OBJECT_ID('users'))
BEGIN
    CREATE INDEX idx_users_status ON users(status);
    PRINT 'Created index on users.status';
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_users_approved' AND object_id = OBJECT_ID('users'))
BEGIN
    CREATE INDEX idx_users_approved ON users(approved);
    PRINT 'Created index on users.approved';
END

-- Add foreign key constraint for approvedBy
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_users_approvedBy')
BEGIN
    ALTER TABLE users ADD CONSTRAINT FK_users_approvedBy 
        FOREIGN KEY (approvedBy) REFERENCES users(id);
    PRINT 'Added foreign key constraint FK_users_approvedBy';
END

-- Update existing users to have approved status (backward compatibility)
-- Verified users are automatically approved
UPDATE users 
SET approved = 1, 
    status = 'approved',
    approvedAt = verifiedAt
WHERE verified = 1 AND approved IS NULL;

PRINT 'User approval fields migration completed successfully!';
