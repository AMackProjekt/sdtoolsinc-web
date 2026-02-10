import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Create client without strict typing for now (types can be generated later)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to create a user profile after signup
 */
export async function createProfile(userId: string, profile: {
  full_name?: string;
  avatar_url?: string;
  role?: "admin" | "case_manager" | "client";
}) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role || "client",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
}

/**
 * Get user profile with all details
 */
export async function getCurrentProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, created_at")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: {
  full_name?: string;
  avatar_url?: string;
}) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

/**
 * Check if user has specific role
 */
export async function hasRole(userId: string, roles: string | string[]) {
  try {
    const profile = await getCurrentProfile(userId);
    if (!profile) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(profile.role || "");
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}

/**
 * Get all clients (for case managers)
 */
export async function getClients(caseManagerId?: string) {
  try {
    let query = supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, created_at")
      .eq("role", "client");

    if (caseManagerId) {
      query = query.eq("case_manager_id", caseManagerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

/**
 * Create a participant/client entry
 */
export async function createParticipant(participant: {
  user_id?: string;
  case_manager_id: string;
  first_name: string;
  last_name: string;
  status?: "Active" | "Waitlist" | "Completed" | "Dropped";
  intake_date: string;
  skills_tags?: string[];
}) {
  try {
    const { data, error } = await supabase
      .from("participants")
      .insert({
        ...participant,
        status: participant.status || "Active",
        skills_tags: participant.skills_tags || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating participant:", error);
    throw error;
  }
}

/**
 * Update participant skills tags
 */
export async function updateParticipantSkills(
  participantId: string,
  skills: string[]
) {
  try {
    const { data, error } = await supabase
      .from("participants")
      .update({ skills_tags: skills, updated_at: new Date().toISOString() })
      .eq("id", participantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating participant skills:", error);
    throw error;
  }
}

/**
 * Search participants by skills tags
 */
export async function searchParticipantsBySkills(skills: string[]) {
  try {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .contains("skills_tags", skills);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error searching participants:", error);
    return [];
  }
}

/**
 * Create an AI consultation log
 */
export async function createAIConsultation(consultation: {
  participant_id: string;
  query: string;
  response: string;
  resources_cited?: string[];
}) {
  try {
    const { data, error } = await supabase
      .from("ai_consultations")
      .insert({
        ...consultation,
        resources_cited: consultation.resources_cited || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating AI consultation:", error);
    throw error;
  }
}

/**
 * Get AI consultation history for a participant
 */
export async function getParticipantConsultations(participantId: string) {
  try {
    const { data, error } = await supabase
      .from("ai_consultations")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }
}

// ============================================
// COURSES & LESSONS - LIVE DATA FUNCTIONS
// ============================================

/**
 * Type definitions for course tables
 */
export interface Program {
  id: string;
  name: string;
  description: string;
  overview: string;
  thumbnail: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  target_audience: string;
  outcomes: string[];
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  program_id: string;
  type: "online" | "in-class" | "hybrid";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  thumbnail: string;
  outline: Record<string, any>;
  prerequisites: string[];
  credits?: number;
  instructors: string[];
  schedule?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  duration: number;
  content: string;
  resources: Array<{
    id: string;
    title: string;
    url: string;
    type: "pdf" | "document" | "link";
  }>;
  lesson_order: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completed_at?: string;
}

/**
 * Get all programs
 */
export async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching programs:", error);
    return [];
  }

  return data || [];
}

/**
 * Get single program by ID
 */
export async function getProgramById(id: string): Promise<Program | null> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching program:", error);
    return null;
  }

  return data;
}

/**
 * Get all courses
 */
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return data || [];
}

/**
 * Get courses by program ID
 */
export async function getCoursesByProgram(programId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("program_id", programId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses by program:", error);
    return [];
  }

  return data || [];
}

/**
 * Get single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return data;
}

/**
 * Get lessons for a course
 */
export async function getLessonsByCourse(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("lesson_order", { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }

  return data || [];
}

/**
 * Get single lesson by ID
 */
export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }

  return data;
}

/**
 * Get user enrollments
 */
export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }

  return data || [];
}

/**
 * Enroll user in a course
 */
export async function enrollCourse(
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error enrolling in course:", error);
    return null;
  }

  return data;
}

/**
 * Mark lesson as complete
 */
export async function markLessonComplete(
  userId: string,
  lessonId: string
): Promise<any | null> {
  const { data, error } = await supabase
    .from("lesson_completions")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error marking lesson complete:", error);
    return null;
  }

  return data;
}

// ============================================
// MESSAGES - COMMUNICATION FUNCTIONS
// ============================================

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  message: string;
  read: boolean;
  parent_message_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get messages for a user (both sent and received)
 */
export async function getMessages(userId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  senderId: string,
  recipientId: string,
  subject: string,
  message: string,
  parentMessageId?: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        subject,
        message,
        parent_message_id: parentMessageId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

/**
 * Mark message as read
 */
export async function markMessageRead(messageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq("id", messageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking message as read:", error);
    return false;
  }
}

/**
 * Get unread message count
 */
export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("read", false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

// ============================================
// REPORTS - ANONYMOUS REPORTING FUNCTIONS
// ============================================

export interface Report {
  id: string;
  user_id?: string;
  report_type: "report" | "grievance" | "feedback";
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "reviewing" | "resolved" | "closed";
  title: string;
  description: string;
  anonymous: boolean;
  resolution?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

/**
 * Submit a report (can be anonymous)
 */
export async function submitReport(report: {
  userId?: string;
  reportType: "report" | "grievance" | "feedback";
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  anonymous: boolean;
}): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert({
        user_id: report.anonymous ? null : report.userId,
        report_type: report.reportType,
        category: report.category,
        priority: report.priority,
        title: report.title,
        description: report.description,
        anonymous: report.anonymous,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error submitting report:", error);
    return null;
  }
}

/**
 * Get user's reports
 */
export async function getUserReports(userId: string): Promise<Report[]> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

// ============================================
// CERTIFICATES FUNCTIONS
// ============================================

/**
 * Get user certificates
 */
export async function getUserCertificates(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .order("completion_date", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

/**
 * Verify certificate by number
 */
export async function verifyCertificate(certificateNumber: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_number", certificateNumber)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return null;
  }
}
