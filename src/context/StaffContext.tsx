"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our "Real Logic"
export interface Participant {
  slot: string;
  name: string;
  status: string;
  environment: string;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  client: string;
  date: string;
  uploader: string;
}

export interface CaseNote {
  id: number;
  clientName: string;
  date: string;
  type: string;
  summary: string;
  staff: string;
}

export interface Notification {
  title: string;
  client: string;
  time: string;
  priority: string;
  type: string;
  read: boolean;
}

export interface JournalEntry {
  id: number;
  client: string;
  date: string;
  mood: string;
  content: string;
}

export interface Feedback {
  id: number;
  client: string;
  type: 'complaint' | 'suggestion';
  content: string;
  date: string;
}

export interface ShoutOut {
  id: number;
  from: string;
  to: string;
  message: string;
  date: string;
}

export interface ParticipantRequest {
  id: number;
  client: string;
  type: string;
  note: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
}

export interface SharedSmartGoal {
  id: number;
  client: string;
  date: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
  status: 'active' | 'completed' | 'missed';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface StaffContextType {
  participants: Participant[];
  documents: Document[];
  caseNotes: CaseNote[];
  notifications: Notification[];
  journals: JournalEntry[];
  feedback: Feedback[];
  shoutOuts: ShoutOut[];
  smartGoals: SharedSmartGoal[];
  requests: ParticipantRequest[];
  team: TeamMember[];
  mission: string;
  addDocument: (doc: Document) => void;
  addCaseNote: (note: CaseNote) => void;
  addJournal: (entry: JournalEntry) => void;
  addFeedback: (fb: Feedback) => void;
  addShoutOut: (so: ShoutOut) => void;
  addSmartGoal: (goal: SharedSmartGoal) => void;
  addRequest: (req: ParticipantRequest) => void;
  updateRequestStatus: (id: number, status: 'approved' | 'denied') => void;
  markNotificationRead: (index: number) => void;
  updateParticipantStatus: (slot: string, newStatus: string) => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

const DATA_KEYS = {
  notes: "notes",
  docs: "docs",
  journals: "journals",
  feedback: "feedback",
  shoutouts: "shoutouts",
  smartgoals: "smartgoals",
  requests: "requests",
} as const;

async function readSecureData<T>(key: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`/api/secure-data/${key}`, { method: "GET" });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as { data?: T };
    return payload.data ?? fallback;
  } catch {
    return fallback;
  }
}

async function writeSecureData<T>(key: string, value: T): Promise<void> {
  try {
    await fetch(`/api/secure-data/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: value }),
    });
  } catch {
    // No-op in UI for offline/dev errors.
  }
}

export function StaffProvider({ children }: { children: React.ReactNode }) {
  // Initial Seed Data
  const [participants, setParticipants] = useState<Participant[]>([
    { slot: 'A1', name: 'UID-A1', status: 'Active', environment: 'A-Block' },
    { slot: 'A2', name: 'UID-A2', status: 'Active', environment: 'A-Block' },
    { slot: 'A3', name: 'UID-A3', status: 'Active (Shared)', environment: 'A-Block' },
    { slot: 'A4', name: 'UID-A4', status: 'Active', environment: 'A-Block' },
    { slot: 'A5', name: 'UID-A5', status: 'Active (Shared)', environment: 'A-Block' },
    { slot: 'A6', name: 'UID-A6', status: 'Empty', environment: 'A-Block' },
    { slot: 'A7', name: 'UID-A7', status: 'Active', environment: 'A-Block' },
    { slot: 'A8', name: 'UID-A8', status: 'Active', environment: 'A-Block' },
    { slot: 'A9', name: 'UID-A9', status: 'Active', environment: 'A-Block' },
    { slot: 'A10', name: 'UID-A10', status: 'Active', environment: 'A-Block' },
    { slot: 'A11', name: 'UID-A11', status: 'Active', environment: 'A-Block' },
    { slot: 'A12', name: 'UID-A12', status: 'Active', environment: 'A-Block' },
    { slot: 'A13', name: 'UID-A13', status: 'Active', environment: 'A-Block' },
    { slot: 'A14', name: 'UID-A14', status: 'Active', environment: 'A-Block' },
    { slot: 'A15', name: 'UID-A15', status: 'Active', environment: 'A-Block' },
    { slot: 'A16', name: 'UID-A16', status: 'Active', environment: 'A-Block' },
    { slot: 'A17', name: 'UID-A17', status: 'Active', environment: 'A-Block' },
    { slot: 'A18', name: 'UID-A18', status: 'Active (Shared)', environment: 'A-Block' },
    
    // D-BLOCK (D6-D12)
    { slot: 'D6', name: 'UID-D6', status: 'Active', environment: 'D-Block' },
    { slot: 'D7', name: 'UID-D7', status: 'Active', environment: 'D-Block' },
    { slot: 'D8', name: 'UID-D8', status: 'Active', environment: 'D-Block' },
    { slot: 'D9', name: 'UID-D9', status: 'Active', environment: 'D-Block' },
    { slot: 'D10', name: 'UID-D10', status: 'Active', environment: 'D-Block' },
    { slot: 'D11', name: 'UID-D11', status: 'Active', environment: 'D-Block' },
    { slot: 'D12', name: 'UID-D12', status: 'Active', environment: 'D-Block' },
    // J-BLOCK (J8-J10)
    { slot: 'J8', name: 'UID-J8', status: 'Active', environment: 'J-Block' },
    { slot: 'J9', name: 'UID-J9', status: 'Active', environment: 'J-Block' },
    { slot: 'J10', name: 'UID-J10', status: 'Active', environment: 'J-Block' },
  ]);

  const [documents, setDocuments] = useState<Document[]>([]);

  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [shoutOuts, setShoutOuts] = useState<ShoutOut[]>([]);
  const [smartGoals, setSmartGoals] = useState<SharedSmartGoal[]>([]);
  const [requests, setRequests] = useState<ParticipantRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Server-side encrypted persistence logic.
  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const [savedNotes, savedDocs, savedJournals, savedFeedback, savedShoutOuts, savedSmartGoals, savedRequests] = await Promise.all([
        readSecureData<CaseNote[]>(DATA_KEYS.notes, []),
        readSecureData<Document[]>(DATA_KEYS.docs, []),
        readSecureData<JournalEntry[]>(DATA_KEYS.journals, []),
        readSecureData<Feedback[]>(DATA_KEYS.feedback, []),
        readSecureData<ShoutOut[]>(DATA_KEYS.shoutouts, []),
        readSecureData<SharedSmartGoal[]>(DATA_KEYS.smartgoals, []),
        readSecureData<ParticipantRequest[]>(DATA_KEYS.requests, []),
      ]);

      if (!mounted) return;

      setCaseNotes(savedNotes);
      setDocuments(savedDocs);
      setJournals(savedJournals);
      setFeedback(savedFeedback);
      setShoutOuts(savedShoutOuts);
      setSmartGoals(savedSmartGoals);
      setRequests(savedRequests);
      setIsHydrated(true);
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.notes, caseNotes);
  }, [caseNotes, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.docs, documents);
  }, [documents, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.journals, journals);
  }, [journals, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.feedback, feedback);
  }, [feedback, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.shoutouts, shoutOuts);
  }, [shoutOuts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.smartgoals, smartGoals);
  }, [smartGoals, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeSecureData(DATA_KEYS.requests, requests);
  }, [requests, isHydrated]);

  // Actions
  const addDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const addCaseNote = (note: CaseNote) => {
    setCaseNotes(prev => [note, ...prev]);
  };

  const addJournal = (entry: JournalEntry) => {
    setJournals(prev => [entry, ...prev]);
  };

  const addFeedback = (fb: Feedback) => {
    setFeedback(prev => [fb, ...prev]);
  };

  const addShoutOut = (so: ShoutOut) => {
    setShoutOuts(prev => [so, ...prev]);
  };

  const addSmartGoal = (goal: SharedSmartGoal) => {
    setSmartGoals(prev => [goal, ...prev]);
  };

  const addRequest = (req: ParticipantRequest) => {
    setRequests(prev => [req, ...prev]);
  };

  const updateRequestStatus = (id: number, status: 'approved' | 'denied') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const markNotificationRead = (index: number) => {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, read: true } : n));
  };

  const updateParticipantStatus = (slot: string, newStatus: string) => {
    setParticipants(prev => prev.map(p => p.slot === slot ? { ...p, status: newStatus } : p));
  };

  const team: TeamMember[] = [
    { id: 'S1', name: 'Staff 01', role: 'Support Specialist' },
    { id: 'T2', name: 'Staff 02', role: 'Case Navigator' },
    { id: 'A3', name: 'Staff 03', role: 'Stabilization Lead' },
    { id: 'D4', name: 'Staff 04', role: 'Intake Coordinator' },
    { id: 'J5', name: 'Staff 05', role: 'Records Manager' }
  ];

  const mission = "The mission of Dreams for Change is to respond to the needs of communities by creating innovative and cost-effective programs to empower and stabilize the lives of underserved families and individuals.";

  return (
    <StaffContext.Provider value={{ 
      participants, 
      documents, 
      caseNotes, 
      notifications,
      journals,
      feedback,
      shoutOuts,
      smartGoals,
      requests,
      team,
      mission,
      addDocument,
      addCaseNote,
      addJournal,
      addFeedback,
      addShoutOut,
      addSmartGoal,
      addRequest,
      updateRequestStatus,
      markNotificationRead,
      updateParticipantStatus
    }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
