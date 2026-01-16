-- SQL Schema for Data Factory Integration
-- T.O.O.L.S Inc Database Schema

-- Users Table
CREATE TABLE [dbo].[Users] (
    [UserId] NVARCHAR(100) PRIMARY KEY,
    [Email] NVARCHAR(255) NOT NULL UNIQUE,
    [FullName] NVARCHAR(255) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [IsActive] BIT NOT NULL DEFAULT 1,
    [LastLoginAt] DATETIME2 NULL,
    CONSTRAINT [CK_Users_Email] CHECK (Email LIKE '%@%')
);

CREATE INDEX IX_Users_Email ON [dbo].[Users]([Email]);
CREATE INDEX IX_Users_CreatedAt ON [dbo].[Users]([CreatedAt]);
GO

-- Referrals Table
CREATE TABLE [dbo].[Referrals] (
    [ReferralId] NVARCHAR(100) PRIMARY KEY,
    [ReferrerName] NVARCHAR(255) NOT NULL,
    [ReferrerEmail] NVARCHAR(255) NOT NULL,
    [ParticipantName] NVARCHAR(255) NOT NULL,
    [ParticipantEmail] NVARCHAR(255) NULL,
    [ProgramInterest] NVARCHAR(500) NULL,
    [SubmittedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    [AssignedTo] NVARCHAR(100) NULL,
    [Notes] NVARCHAR(MAX) NULL,
    CONSTRAINT [CK_Referrals_Status] CHECK (Status IN ('Pending', 'InProgress', 'Completed', 'Rejected'))
);

CREATE INDEX IX_Referrals_Status ON [dbo].[Referrals]([Status]);
CREATE INDEX IX_Referrals_SubmittedAt ON [dbo].[Referrals]([SubmittedAt]);
CREATE INDEX IX_Referrals_ReferrerEmail ON [dbo].[Referrals]([ReferrerEmail]);
GO

-- Projects Table
CREATE TABLE [dbo].[Projects] (
    [ProjectId] NVARCHAR(100) PRIMARY KEY,
    [ProjectName] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Active',
    [OwnerId] NVARCHAR(100) NULL,
    CONSTRAINT [FK_Projects_Users] FOREIGN KEY ([OwnerId]) REFERENCES [dbo].[Users]([UserId]),
    CONSTRAINT [CK_Projects_Status] CHECK (Status IN ('Active', 'Completed', 'Archived'))
);

CREATE INDEX IX_Projects_Status ON [dbo].[Projects]([Status]);
CREATE INDEX IX_Projects_OwnerId ON [dbo].[Projects]([OwnerId]);
GO

-- Activity Log Table
CREATE TABLE [dbo].[ActivityLog] (
    [LogId] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] NVARCHAR(100) NULL,
    [ActivityType] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [Timestamp] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [IpAddress] NVARCHAR(50) NULL,
    [UserAgent] NVARCHAR(500) NULL,
    CONSTRAINT [FK_ActivityLog_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId])
);

CREATE INDEX IX_ActivityLog_UserId ON [dbo].[ActivityLog]([UserId]);
CREATE INDEX IX_ActivityLog_Timestamp ON [dbo].[ActivityLog]([Timestamp]);
CREATE INDEX IX_ActivityLog_ActivityType ON [dbo].[ActivityLog]([ActivityType]);
GO

-- Data Sync Log Table (for Data Factory tracking)
CREATE TABLE [dbo].[DataSyncLog] (
    [SyncId] INT IDENTITY(1,1) PRIMARY KEY,
    [EventType] NVARCHAR(100) NOT NULL,
    [Status] NVARCHAR(50) NOT NULL,
    [RecordCount] INT NULL,
    [ErrorMessage] NVARCHAR(MAX) NULL,
    [StartTime] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [EndTime] DATETIME2 NULL,
    [DurationSeconds] AS DATEDIFF(SECOND, StartTime, EndTime),
    CONSTRAINT [CK_DataSyncLog_Status] CHECK (Status IN ('Success', 'Failed', 'PartialSuccess'))
);

CREATE INDEX IX_DataSyncLog_EventType ON [dbo].[DataSyncLog]([EventType]);
CREATE INDEX IX_DataSyncLog_StartTime ON [dbo].[DataSyncLog]([StartTime]);
GO

-- Stored Procedure: Log Data Sync Events
CREATE PROCEDURE [dbo].[LogDataSyncEvent]
    @EventType NVARCHAR(100),
    @Status NVARCHAR(50),
    @RecordCount INT = NULL,
    @ErrorMessage NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[DataSyncLog] (EventType, Status, RecordCount, ErrorMessage, EndTime)
    VALUES (@EventType, @Status, @RecordCount, @ErrorMessage, GETUTCDATE());
END
GO

-- Stored Procedure: Update User Last Login
CREATE PROCEDURE [dbo].[UpdateUserLastLogin]
    @UserId NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [dbo].[Users]
    SET LastLoginAt = GETUTCDATE(),
        UpdatedAt = GETUTCDATE()
    WHERE UserId = @UserId;
END
GO

-- Stored Procedure: Get Active Referrals
CREATE PROCEDURE [dbo].[GetActiveReferrals]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ReferralId,
        ReferrerName,
        ReferrerEmail,
        ParticipantName,
        ParticipantEmail,
        ProgramInterest,
        SubmittedAt,
        Status,
        AssignedTo
    FROM [dbo].[Referrals]
    WHERE Status IN ('Pending', 'InProgress')
    ORDER BY SubmittedAt DESC;
END
GO

-- View: User Activity Summary
CREATE VIEW [dbo].[vw_UserActivitySummary] AS
SELECT 
    u.UserId,
    u.FullName,
    u.Email,
    u.CreatedAt,
    u.LastLoginAt,
    COUNT(DISTINCT a.LogId) AS ActivityCount,
    MAX(a.Timestamp) AS LastActivityAt
FROM [dbo].[Users] u
LEFT JOIN [dbo].[ActivityLog] a ON u.UserId = a.UserId
GROUP BY u.UserId, u.FullName, u.Email, u.CreatedAt, u.LastLoginAt;
GO

-- View: Referral Summary
CREATE VIEW [dbo].[vw_ReferralSummary] AS
SELECT 
    Status,
    COUNT(*) AS TotalReferrals,
    COUNT(DISTINCT ReferrerEmail) AS UniqueReferrers,
    MIN(SubmittedAt) AS FirstReferralDate,
    MAX(SubmittedAt) AS LastReferralDate
FROM [dbo].[Referrals]
GROUP BY Status;
GO

-- View: Data Sync Performance
CREATE VIEW [dbo].[vw_DataSyncPerformance] AS
SELECT 
    EventType,
    Status,
    COUNT(*) AS SyncCount,
    AVG(DurationSeconds) AS AvgDurationSeconds,
    SUM(RecordCount) AS TotalRecordsSynced,
    MAX(StartTime) AS LastSyncTime
FROM [dbo].[DataSyncLog]
WHERE StartTime >= DATEADD(DAY, -30, GETUTCDATE())
GROUP BY EventType, Status;
GO

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON [dbo].[Users] TO [data-factory-user];
-- GRANT EXECUTE ON [dbo].[LogDataSyncEvent] TO [data-factory-user];
