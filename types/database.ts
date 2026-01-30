export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'case_manager' | 'client';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  email: string;
  created_at: string;
}

export interface Participant {
  id: string;
  user_id?: string;
  case_manager_id: string;
  first_name: string;
  last_name: string;
  status: 'Active' | 'Waitlist' | 'Completed' | 'Dropped';
  intake_date: string;
  skills_tags: string[];
  updated_at: string;
}

// MackAi Interaction Log
export interface AIConsultation {
  id: string;
  participant_id: string;
  query: string;
  response: string;
  resources_cited: string[]; // Links to local SD resources
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "case_manager" | "client";
          case_manager_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "case_manager" | "client";
          case_manager_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "case_manager" | "client";
          case_manager_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          user_id: string | null;
          case_manager_id: string;
          first_name: string;
          last_name: string;
          status: "Active" | "Waitlist" | "Completed" | "Dropped";
          intake_date: string;
          skills_tags: string[];
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          case_manager_id: string;
          first_name: string;
          last_name: string;
          status?: "Active" | "Waitlist" | "Completed" | "Dropped";
          intake_date: string;
          skills_tags?: string[];
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          case_manager_id?: string;
          first_name?: string;
          last_name?: string;
          status?: "Active" | "Waitlist" | "Completed" | "Dropped";
          intake_date?: string;
          skills_tags?: string[];
          updated_at?: string;
          created_at?: string;
        };
      };
      ai_consultations: {
        Row: {
          id: string;
          participant_id: string;
          query: string;
          response: string;
          resources_cited: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id: string;
          query: string;
          response: string;
          resources_cited?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_id?: string;
          query?: string;
          response?: string;
          resources_cited?: string[];
          created_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          provider: string | null;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          provider?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          provider?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          status: "pending" | "accepted" | "completed" | "declined";
          referred_date: string;
          completed_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id: string;
          status?: "pending" | "accepted" | "completed" | "declined";
          referred_date?: string;
          completed_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          program_id?: string;
          status?: "pending" | "accepted" | "completed" | "declined";
          referred_date?: string;
          completed_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          thumbnail_url: string | null;
          video_url: string | null;
          duration: number | null;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: string;
          thumbnail_url?: string | null;
          video_url?: string | null;
          duration?: number | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          thumbnail_url?: string | null;
          video_url?: string | null;
          duration?: number | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress: number;
          completed: boolean;
          enrolled_date: string;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress?: number;
          completed?: boolean;
          enrolled_date?: string;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          progress?: number;
          completed?: boolean;
          enrolled_date?: string;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "admin" | "case_manager" | "client";
      participant_status: "active" | "inactive";
      referral_status: "pending" | "accepted" | "completed" | "declined";
      course_status: "draft" | "published" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
