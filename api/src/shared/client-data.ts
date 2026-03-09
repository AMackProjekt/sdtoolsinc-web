import { query } from "./database";

let initPromise: Promise<void> | null = null;

export async function ensureClientDataTables(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await query(`
IF OBJECT_ID('dbo.ClientMessages', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.ClientMessages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SenderId NVARCHAR(200) NOT NULL,
    SenderName NVARCHAR(255) NOT NULL,
    Subject NVARCHAR(255) NOT NULL,
    Preview NVARCHAR(500) NOT NULL,
    Body NVARCHAR(MAX) NOT NULL,
    [Timestamp] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsRead BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_ClientMessages_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
  );
  CREATE INDEX IX_ClientMessages_UserId_Timestamp ON dbo.ClientMessages(UserId, [Timestamp] DESC);
END
      `);

      await query(`
IF OBJECT_ID('dbo.ClientJournalEntries', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.ClientJournalEntries (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    [Date] DATE NOT NULL,
    [Type] NVARCHAR(20) NOT NULL,
    EmotionalState INT NOT NULL,
    TrialsBarriers NVARCHAR(MAX) NULL,
    ProgressFeeling INT NOT NULL,
    SelfCare NVARCHAR(MAX) NOT NULL DEFAULT '[]',
    SelfLove NVARCHAR(MAX) NULL,
    Exercise NVARCHAR(255) NULL,
    GrowthMoment NVARCHAR(MAX) NOT NULL,
    PersonalInsight NVARCHAR(MAX) NULL,
    IsPrivate BIT NOT NULL DEFAULT 0,
    Summary NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ClientJournalEntries_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
  );
  CREATE INDEX IX_ClientJournalEntries_UserId_Date ON dbo.ClientJournalEntries(UserId, [Date] DESC);
END
      `);

      await query(`
IF OBJECT_ID('dbo.ClientAuditEvents', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.ClientAuditEvents (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NULL,
    EventType NVARCHAR(150) NOT NULL,
    EventData NVARCHAR(MAX) NULL,
    [Level] NVARCHAR(20) NULL,
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
  );
  CREATE INDEX IX_ClientAuditEvents_CreatedAt ON dbo.ClientAuditEvents(CreatedAt DESC);
END
      `);
    })();
  }

  await initPromise;
}
