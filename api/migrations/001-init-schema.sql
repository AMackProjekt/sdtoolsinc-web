-- T.O.O.L.S Inc Authentication and Case Manager Portal Schema

-- Users Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "users")
BEGIN
    CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT "user",
        verified BIT DEFAULT 0,
        verificationToken VARCHAR(500),
        verifiedAt DATETIME2,
        caseManagerId VARCHAR(36),
        nextCheckInDate DATETIME2,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        lastLoginAt DATETIME2,
        FOREIGN KEY (caseManagerId) REFERENCES users(id)
    );
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_caseManagerId ON users(caseManagerId);
END

-- Enrollments Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "enrollments")
BEGIN
    CREATE TABLE enrollments (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        userId VARCHAR(36) NOT NULL,
        courseId VARCHAR(36) NOT NULL,
        enrolledAt DATETIME2 DEFAULT GETDATE(),
        completed BIT DEFAULT 0,
        completedAt DATETIME2,
        progress INT DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
    );
    CREATE INDEX idx_enrollments_userId ON enrollments(userId);
END

-- Courses Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "courses")
BEGIN
    CREATE TABLE courses (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        title VARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category VARCHAR(100),
        createdAt DATETIME2 DEFAULT GETDATE()
    );
END

-- Lessons Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "lessons")
BEGIN
    CREATE TABLE lessons (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        courseId VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content NVARCHAR(MAX),
        videoUrl VARCHAR(500),
        duration INT,
        orderIndex INT,
        createdAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (courseId) REFERENCES courses(id)
    );
    CREATE INDEX idx_lessons_courseId ON lessons(courseId);
END

-- Completed Lessons Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "completedLessons")
BEGIN
    CREATE TABLE completedLessons (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        userId VARCHAR(36) NOT NULL,
        lessonId VARCHAR(36) NOT NULL,
        completedAt DATETIME2 DEFAULT GETDATE(),
        score INT,
        UNIQUE (userId, lessonId),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (lessonId) REFERENCES lessons(id)
    );
    CREATE INDEX idx_completedLessons_userId ON completedLessons(userId);
END

-- Certificates Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "certificates")
BEGIN
    CREATE TABLE certificates (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        userId VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        courseId VARCHAR(36),
        earnedDate DATETIME2 DEFAULT GETDATE(),
        certificateUrl VARCHAR(500),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (courseId) REFERENCES courses(id)
    );
    CREATE INDEX idx_certificates_userId ON certificates(userId);
END

-- Goals Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "goals")
BEGIN
    CREATE TABLE goals (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        userId VARCHAR(36) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        targetDate DATETIME2,
        status VARCHAR(50),
        progress INT DEFAULT 0,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id)
    );
    CREATE INDEX idx_goals_userId ON goals(userId);
END

-- Messages Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "messages")
BEGIN
    CREATE TABLE messages (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        senderId VARCHAR(36) NOT NULL,
        recipientId VARCHAR(36) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        readAt DATETIME2,
        createdAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (senderId) REFERENCES users(id),
        FOREIGN KEY (recipientId) REFERENCES users(id)
    );
    CREATE INDEX idx_messages_senderId ON messages(senderId);
    CREATE INDEX idx_messages_recipientId ON messages(recipientId);
    CREATE INDEX idx_messages_createdAt ON messages(createdAt DESC);
END

-- Audit Log Table
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "auditLog")
BEGIN
    CREATE TABLE auditLog (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        userId VARCHAR(36),
        action VARCHAR(100) NOT NULL,
        details NVARCHAR(MAX),
        timestamp DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id)
    );
    CREATE INDEX idx_auditLog_userId ON auditLog(userId);
    CREATE INDEX idx_auditLog_timestamp ON auditLog(timestamp DESC);
END

PRINT "Database schema created successfully!";
