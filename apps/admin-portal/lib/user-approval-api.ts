/**
 * Admin Portal - User Approval API
 * Functions for managing pending user approvals in Supabase
 */

import { supabase } from "./supabase";

export interface PendingUser {
  id: string;
  email: string;
  display_name: string;
  role: string;
  status: string;
  created_at: string;
  email_confirmed_at: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
}

/**
 * Fetch all users with pending approval status
 */
export async function fetchPendingUsers(): Promise<PendingUser[]> {
  try {
    // Get session token for authenticated requests
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    // Query Supabase Auth users
    // NOTE: This requires Supabase Admin API or a serverless function with service role key
    // For now, we'll use the Management API if available
    
    // Alternative: Create a server-side API route that uses the service role
    const response = await fetch('/api/admin/users/pending', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending users');
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw error;
  }
}

/**
 * Approve a pending user
 */
export async function approveUser(userId: string): Promise<void> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`/api/admin/users/${userId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve user');
    }
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
}

/**
 * Reject a pending user
 */
export async function rejectUser(userId: string, reason: string): Promise<void> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`/api/admin/users/${userId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject user');
    }
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
}

/**
 * Bulk approve multiple users
 */
export async function bulkApproveUsers(userIds: string[]): Promise<void> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/admin/users/bulk-approve', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to bulk approve users');
    }
  } catch (error) {
    console.error('Error bulk approving users:', error);
    throw error;
  }
}
