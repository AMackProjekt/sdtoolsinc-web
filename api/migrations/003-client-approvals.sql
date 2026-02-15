-- Client Approval Workflow Functions
-- Run these in Supabase SQL Editor

-- Function: Approve a pending client
CREATE OR REPLACE FUNCTION approve_client(
  client_id UUID,
  approver_id UUID,
  approval_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  client_email TEXT;
  client_name TEXT;
BEGIN
  -- Check if approver has permission (admin or case_manager)
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = approver_id 
    AND role IN ('admin', 'case_manager')
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins and case managers can approve clients';
  END IF;

  -- Get client details
  SELECT email INTO client_email FROM auth.users WHERE id = client_id;
  SELECT full_name INTO client_name FROM profiles WHERE id = client_id;

  -- Update profile status
  UPDATE profiles
  SET 
    status = 'approved',
    approved = true,
    approved_by = approver_id,
    approved_at = NOW(),
    notes = COALESCE(notes || E'\n\n', '') || 
            'Approved on ' || NOW()::TEXT || 
            COALESCE(E'\nNotes: ' || approval_notes, '')
  WHERE id = client_id;

  -- Update auth user email_confirmed (unlock account)
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = client_id AND email_confirmed_at IS NULL;

  -- Create notification log
  INSERT INTO notifications (user_id, type, title, message, read)
  VALUES (
    client_id,
    'approval',
    'Your application has been approved!',
    'Welcome to T.O.O.L.S Inc! You now have full access to your client portal.',
    false
  );

  -- Return success
  result := json_build_object(
    'success', true,
    'client_id', client_id,
    'client_email', client_email,
    'client_name', client_name,
    'approved_at', NOW(),
    'message', 'Client approved successfully'
  );

  RETURN result;
END;
$$;

-- Function: Reject a pending client
CREATE OR REPLACE FUNCTION reject_client(
  client_id UUID,
  rejector_id UUID,
  rejection_reason TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  client_email TEXT;
  client_name TEXT;
BEGIN
  -- Check if rejector has permission
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = rejector_id 
    AND role IN ('admin', 'case_manager')
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins and case managers can reject clients';
  END IF;

  -- Require rejection reason
  IF rejection_reason IS NULL OR LENGTH(TRIM(rejection_reason)) = 0 THEN
    RAISE EXCEPTION 'Rejection reason is required';
  END IF;

  -- Get client details
  SELECT email INTO client_email FROM auth.users WHERE id = client_id;
  SELECT full_name INTO client_name FROM profiles WHERE id = client_id;

  -- Update profile status
  UPDATE profiles
  SET 
    status = 'rejected',
    approved = false,
    rejection_reason = rejection_reason,
    rejected_by = rejector_id,
    rejected_at = NOW()
  WHERE id = client_id;

  -- Create notification log
  INSERT INTO notifications (user_id, type, title, message, read)
  VALUES (
    client_id,
    'rejection',
    'Application Update',
    'Your application requires additional information. Please contact us at info@sdtoolsinc.org',
    false
  );

  -- Return success
  result := json_build_object(
    'success', true,
    'client_id', client_id,
    'client_email', client_email,
    'client_name', client_name,
    'rejected_at', NOW(),
    'reason', rejection_reason,
    'message', 'Client rejected with notification sent'
  );

  RETURN result;
END;
$$;

-- Function: Get all pending clients (for approvals dashboard)
CREATE OR REPLACE FUNCTION get_pending_clients()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  referral_source TEXT,
  status TEXT,
  submitted_at TIMESTAMPTZ,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    u.email,
    p.phone,
    p.referral_source,
    p.status,
    p.created_at AS submitted_at,
    p.notes
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE p.status = 'pending'
  ORDER BY p.created_at DESC;
END;
$$;

-- Function: Get approval stats
CREATE OR REPLACE FUNCTION get_approval_stats(timeframe TEXT DEFAULT 'month')
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSON;
  start_date TIMESTAMPTZ;
BEGIN
  -- Calculate start date based on timeframe
  CASE timeframe
    WHEN 'day' THEN start_date := NOW() - INTERVAL '1 day';
    WHEN 'week' THEN start_date := NOW() - INTERVAL '1 week';
    WHEN 'month' THEN start_date := NOW() - INTERVAL '1 month';
    WHEN 'year' THEN start_date := NOW() - INTERVAL '1 year';
    ELSE start_date := NOW() - INTERVAL '1 month';
  END CASE;

  SELECT json_build_object(
    'pending', (SELECT COUNT(*) FROM profiles WHERE status = 'pending'),
    'approved_today', (SELECT COUNT(*) FROM profiles WHERE status = 'approved' AND approved_at >= DATE_TRUNC('day', NOW())),
    'approved_timeframe', (SELECT COUNT(*) FROM profiles WHERE status = 'approved' AND approved_at >= start_date),
    'rejected_timeframe', (SELECT COUNT(*) FROM profiles WHERE status = 'rejected' AND rejected_at >= start_date),
    'avg_approval_time_hours', (
      SELECT EXTRACT(EPOCH FROM AVG(approved_at - created_at))/3600 
      FROM profiles 
      WHERE status = 'approved' 
      AND approved_at >= start_date
    )
  ) INTO stats;

  RETURN stats;
END;
$$;

-- Notifications table (if not exists)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'approval', 'rejection', 'info', 'alert'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing profile columns (run if they don't exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_approved_at ON profiles(approved_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Row Level Security (RLS) Policies

-- Clients can only read their own profile
CREATE POLICY "Clients view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id OR auth.uid() IN (
  SELECT id FROM profiles WHERE role IN ('admin', 'case_manager')
));

-- Only admins and case managers can update profiles
CREATE POLICY "Admins/Case Managers update profiles"
ON profiles FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role IN ('admin', 'case_manager')
));

-- Clients can read their own notifications
CREATE POLICY "Users read own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can mark their notifications as read
CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

COMMENT ON FUNCTION approve_client IS 'Approves a pending client application and sends welcome notification';
COMMENT ON FUNCTION reject_client IS 'Rejects a client application with reason and sends notification';
COMMENT ON FUNCTION get_pending_clients IS 'Returns all pending client applications for approval dashboard';
COMMENT ON FUNCTION get_approval_stats IS 'Returns approval/rejection statistics for specified timeframe';
