/**
 * Case Manager Portal API Hooks
 */

import { useAuth } from "@/lib/auth-new";
import { useState, useCallback } from "react";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Pending";
  enrolledPrograms: number;
  completedPrograms: number;
  lastContactDate: string | null;
  nextCheckIn: string | null;
}

export interface ClientProgress {
  clientId: string;
  enrolledCourses: number;
  completedCourses: number;
  currentCourses: Array<{
    courseId: string;
    courseName: string;
    progress: number;
    lastAccessed: string | null;
  }>;
  certifications: Array<{
    certificateId: string;
    certificateName: string;
    earnedDate: string;
  }>;
  goals: Array<{
    goalId: string;
    goalDescription: string;
    targetDate: string;
    status: string;
    progress: number;
  }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export function useCaseManagerClients() {
  const { getToken } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${API_BASE}/casemgr/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch clients");

      const data = await response.json();
      setClients(data.clients || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching clients:", message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  return { clients, isLoading, error, fetchClients };
}

export function useClientProgress() {
  const { getToken } = useAuth();
  const [progress, setProgress] = useState<ClientProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(
    async (clientId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        const response = await fetch(
          `${API_BASE}/casemgr/clients/${clientId}/progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch progress");

        const data = await response.json();
        setProgress(data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching progress:", message);
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  return { progress, isLoading, error, fetchProgress };
}
