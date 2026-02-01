-- T.O.O.L.S Inc Portal Database Schema
-- Azure SQL Database

-- Users table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    DisplayName NVARCHAR(255) NOT NULL,
    EntraId NVARCHAR(255) UNIQUE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    IsActive BIT DEFAULT 1,
    Role NVARCHAR(50) DEFAULT 'Client'
);

-- User Profiles
CREATE TABLE UserProfiles (
    UserId UNIQUEIDENTIFIER PRIMARY KEY,
    PhoneNumber NVARCHAR(20),
    DateOfBirth DATE,
    Address NVARCHAR(500),
    City NVARCHAR(100),
    State NVARCHAR(50),
    ZipCode NVARCHAR(10),
    EmergencyContact NVARCHAR(255),
    EmergencyPhone NVARCHAR(20),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Progress Tracking
CREATE TABLE ProgressLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Category NVARCHAR(100) NOT NULL, -- JobReadiness, Education, Housing, etc
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL, -- InProgress, Completed, Blocked
    CompletedDate DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Resources
CREATE TABLE Resources (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Document, Video, Link, Tool
    Url NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- User Resource Access
CREATE TABLE UserResourceAccess (
    UserId UNIQUEIDENTIFIER NOT NULL,
    ResourceId INT NOT NULL,
    AccessedAt DATETIME2 DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2,
    PRIMARY KEY (UserId, ResourceId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (ResourceId) REFERENCES Resources(Id) ON DELETE CASCADE
);

-- Appointments/Sessions
CREATE TABLE Appointments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Type NVARCHAR(50) NOT NULL, -- Counseling, JobInterview, Training, Mentorship
    ScheduledAt DATETIME2 NOT NULL,
    DurationMinutes INT DEFAULT 60,
    Status NVARCHAR(50) NOT NULL, -- Scheduled, Completed, Cancelled
    MeetingLink NVARCHAR(500),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Goals
CREATE TABLE Goals (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(100),
    TargetDate DATE,
    Status NVARCHAR(50) NOT NULL, -- Active, Completed, Deferred
    CompletedDate DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Activity Log
CREATE TABLE ActivityLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Action NVARCHAR(100) NOT NULL,
    Details NVARCHAR(MAX),
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_EntraId ON Users(EntraId);
CREATE INDEX IX_ProgressLogs_UserId ON ProgressLogs(UserId);
CREATE INDEX IX_Appointments_UserId_ScheduledAt ON Appointments(UserId, ScheduledAt);
CREATE INDEX IX_Goals_UserId ON Goals(UserId);
CREATE INDEX IX_ActivityLogs_UserId_CreatedAt ON ActivityLogs(UserId, CreatedAt);

-- Sample data
INSERT INTO Resources (Title, Description, Category, Type, Url) VALUES
('Resume Building Guide', 'Comprehensive guide to creating professional resumes', 'JobReadiness', 'Document', 'https://example.com/resume-guide.pdf'),
('Interview Preparation Video', 'Tips and techniques for successful job interviews', 'JobReadiness', 'Video', 'https://example.com/interview-tips'),
('Financial Literacy Course', 'Basic financial management and budgeting skills', 'Education', 'Link', 'https://example.com/finance-course'),
('Housing Resources Directory', 'List of housing assistance programs and contacts', 'Housing', 'Document', 'https://example.com/housing-resources');
