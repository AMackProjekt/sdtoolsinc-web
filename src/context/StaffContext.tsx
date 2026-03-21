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

export function StaffProvider({ children }: { children: React.ReactNode }) {
  // Initial Seed Data
  const [participants, setParticipants] = useState<Participant[]>([
    { slot: 'A1', name: 'Christopher "Memphis" Greer', status: 'Active', environment: 'A-Block' },
    { slot: 'A2', name: 'Calvin Hobby', status: 'Active', environment: 'A-Block' },
    { slot: 'A3', name: 'Brett Purettman/ Sheila Martinez', status: 'Active (Shared)', environment: 'A-Block' },
    { slot: 'A4', name: 'Tianna "Diamond" Hoover', status: 'Active', environment: 'A-Block' },
    { slot: 'A5', name: 'Victor/ Rosanna Vasquez', status: 'Active (Shared)', environment: 'A-Block' },
    { slot: 'A6', name: 'Empty Slot', status: 'Broken Platform', environment: 'A-Block' },
    { slot: 'A7', name: 'Martin Navarette', status: 'Active', environment: 'A-Block' },
    { slot: 'A8', name: 'Heather Navarette', status: 'Active', environment: 'A-Block' },
    { slot: 'A9', name: 'Ian Buonamici', status: 'Active', environment: 'A-Block' },
    { slot: 'A10', name: 'Orrin "Keith" Page', status: 'Active', environment: 'A-Block' },
    
    // D & J BLOCK
    { slot: 'D9', name: 'John Brackman', status: 'Active', environment: 'D-Block' },
    { slot: 'D10', name: 'Anthony Jones', status: 'Active', environment: 'D-Block' },
    { slot: 'J1', name: 'Waitlist J1', status: 'Pending', environment: 'J-Block' },
    { slot: 'J2', name: 'Waitlist J2', status: 'Pending', environment: 'J-Block' },
    { slot: 'J8', name: 'Alisa Foster', status: 'Active', environment: 'J-Block' },
    { slot: 'J9', name: 'Anthony Garner', status: 'Active', environment: 'J-Block' },
    { slot: 'J10', name: 'Ernestina Alvarado', status: 'Active', environment: 'J-Block' },
  ]);

  const [documents, setDocuments] = useState<Document[]>([]);

  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [shoutOuts, setShoutOuts] = useState<ShoutOut[]>([]);
  const [smartGoals, setSmartGoals] = useState<SharedSmartGoal[]>([]);
  const [requests, setRequests] = useState<ParticipantRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // PERSISTENCE LOGIC
  useEffect(() => {
    const savedNotes = localStorage.getItem("caseflow_notes");
    const savedDocs = localStorage.getItem("caseflow_docs");
    const savedJournals = localStorage.getItem("caseflow_journals");
    const savedFeedback = localStorage.getItem("caseflow_feedback");
    const savedShoutOuts = localStorage.getItem("caseflow_shoutouts");
    const savedSmartGoals = localStorage.getItem("caseflow_smartgoals");
    const savedRequests = localStorage.getItem("caseflow_requests");

    if (savedNotes) setCaseNotes(JSON.parse(savedNotes));
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
    if (savedJournals) setJournals(JSON.parse(savedJournals));
    if (savedFeedback) setFeedback(JSON.parse(savedFeedback));
    if (savedShoutOuts) setShoutOuts(JSON.parse(savedShoutOuts));
    if (savedSmartGoals) setSmartGoals(JSON.parse(savedSmartGoals));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, []);

  useEffect(() => {
    localStorage.setItem("caseflow_notes", JSON.stringify(caseNotes));
  }, [caseNotes]);

  useEffect(() => {
    localStorage.setItem("caseflow_docs", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("caseflow_journals", JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem("caseflow_feedback", JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem("caseflow_shoutouts", JSON.stringify(shoutOuts));
  }, [shoutOuts]);

  useEffect(() => {
    localStorage.setItem("caseflow_smartgoals", JSON.stringify(smartGoals));
  }, [smartGoals]);

  useEffect(() => {
    localStorage.setItem("caseflow_requests", JSON.stringify(requests));
  }, [requests]);

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
    console.log(`Action Sync: Request ${id} ${status.toUpperCase()} trigger sent to donyale@dreamsforchange.org`);
  };

  const markNotificationRead = (index: number) => {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, read: true } : n));
  };

  const updateParticipantStatus = (slot: string, newStatus: string) => {
    setParticipants(prev => prev.map(p => p.slot === slot ? { ...p, status: newStatus } : p));
  };

  const team: TeamMember[] = [
    { id: 'S1', name: 'Spencer', role: 'Support Specialist' },
    { id: 'T2', name: 'Tonya', role: 'Case Navigator' },
    { id: 'A3', name: 'Abby', role: 'Stabilization Lead' },
    { id: 'D4', name: 'Daniel', role: 'Intake Coordinator' },
    { id: 'J5', name: 'Jonathan', role: 'Records Manager' }
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
