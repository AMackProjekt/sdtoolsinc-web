-- PORTAL ENHANCEMENTS SCHEMA
-- Messages, Reports, Certificates, and Profile Extensions

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  parent_message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(parent_message_id);

-- RLS policies for messages (users can only see messages they sent or received)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update read status"
  ON messages FOR UPDATE
  USING (auth.uid() = recipient_id);

CREATE POLICY "Senders can delete their sent messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);

-- ============================================
-- REPORTS TABLE (Anonymous Reporting & Grievances)
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- Nullable for anonymous
  report_type TEXT NOT NULL CHECK (report_type IN ('report', 'grievance', 'feedback')),
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'closed')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT FALSE,
  resolution TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes for reports
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);
CREATE INDEX IF NOT EXISTS idx_reports_assigned ON reports(assigned_to);

-- RLS policies for reports (allow anonymous submissions, users can see their own)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id OR anonymous = TRUE);

CREATE POLICY "Anyone can submit reports (including anonymous)"
  ON reports FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON reports FOR UPDATE
  USING (auth.uid() = user_id AND anonymous = FALSE);

CREATE POLICY "Case managers can view all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('case_manager', 'admin')
    )
  );

CREATE POLICY "Case managers can update all reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('case_manager', 'admin')
    )
  );

-- ============================================
-- CERTIFICATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  completion_date TIMESTAMPTZ NOT NULL,
  score INTEGER,
  verification_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);

-- RLS policies for certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create certificates"
  ON certificates FOR INSERT
  WITH CHECK (true);  -- This should be restricted to backend services in production

CREATE POLICY "Public can verify certificates by number"
  ON certificates FOR SELECT
  USING (true);  -- Anyone can verify a certificate by its number

-- ============================================
-- PROFILE EXTENSIONS
-- ============================================
-- Add new columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS case_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"notifications": true, "emailUpdates": true, "theme": "dark", "fontSize": "medium", "accentColor": "#38bdf8"}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS demographics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact JSONB DEFAULT '{}'::jsonb;

-- Indexes for new fields
CREATE INDEX IF NOT EXISTS idx_profiles_case_manager ON profiles(case_manager_id);
CREATE INDEX IF NOT EXISTS idx_profiles_preferences ON profiles USING GIN (preferences);

-- ============================================
-- FUNCTIONS FOR MESSAGE OPERATIONS
-- ============================================

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM messages
    WHERE recipient_id = user_uuid AND read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_read(message_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE messages
  SET read = TRUE, updated_at = NOW()
  WHERE id = message_uuid AND recipient_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample categories for reports
COMMENT ON COLUMN reports.category IS 'Categories: Harassment, Safety, Discrimination, Program Issue, Facility Issue, Staff Conduct, Other';

-- Sample verification number format: CERT-YYYY-XXXXXX
-- Example: CERT-2024-001234
