"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, User, Mail, Phone, FileText } from "lucide-react";

type PendingClient = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  referral_source?: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  notes?: string;
};

export default function ApprovalsPage() {
  const [pendingClients, setPendingClients] = useState<PendingClient[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedClient, setSelectedClient] = useState<PendingClient | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with Supabase fetch
  useEffect(() => {
    const mockData: PendingClient[] = [
      {
        id: "1",
        full_name: "John Doe",
        email: "john.doe@example.com",
        phone: "(619) 555-0123",
        referral_source: "San Diego Probation",
        status: "pending",
        submitted_at: "2026-02-14T10:30:00Z",
        notes: "Referred by Officer Smith. Currently on probation, needs job training.",
      },
      {
        id: "2",
        full_name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(619) 555-0456",
        referral_source: "Community Advocate",
        status: "pending",
        submitted_at: "2026-02-14T09:15:00Z",
        notes: "Self-referred through interest form. Post-release, seeking housing resources.",
      },
    ];
    setPendingClients(mockData);
  }, []);

  const handleApprove = async (clientId: string) => {
    setIsLoading(true);
    try {
      // TODO: Call Supabase function to approve client
      // await supabase.rpc('approve_client', { client_id: clientId, notes: actionNotes })
      
      // Update local state
      setPendingClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, status: "approved" as const }
            : client
        )
      );
      
      setSelectedClient(null);
      setActionNotes("");
      
      // TODO: Trigger welcome email via Azure Function
    } catch (error) {
      console.error("Error approving client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (clientId: string) => {
    if (!actionNotes) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    setIsLoading(true);
    try {
      // TODO: Call Supabase function to reject client
      // await supabase.rpc('reject_client', { client_id: clientId, reason: actionNotes })
      
      setPendingClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, status: "rejected" as const }
            : client
        )
      );
      
      setSelectedClient(null);
      setActionNotes("");
      
      // TODO: Send rejection email with resources
    } catch (error) {
      console.error("Error rejecting client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = pendingClients.filter((client) =>
    filter === "all" ? true : client.status === filter
  );

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Client Approvals</h1>
          <p className="text-muted">
            Review and approve or reject pending client applications
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-brand text-bg"
                  : "bg-panel text-muted hover:text-text border border-border"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-2 text-sm">
                ({pendingClients.filter((c) => f === "all" ? true : c.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Client List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-panel rounded-xl border border-border p-6 hover:border-brand/50 transition-colors"
            >
              {/* Client Info */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text">{client.full_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                      <Clock className="h-4 w-4" />
                      {new Date(client.submitted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : client.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-muted">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                  )}
                  {client.referral_source && (
                    <div className="flex items-center gap-2 text-muted">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Referred by:</span> {client.referral_source}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="mb-4 p-3 bg-bg rounded-lg border border-border/50">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-brand mt-0.5" />
                    <p className="text-sm text-muted leading-relaxed">{client.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {client.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-muted text-lg">No {filter !== "all" && filter} applications found</p>
          </div>
        )}
      </div>

      {/* Approval/Rejection Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-panel rounded-xl border border-border p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-text mb-4">
              Confirm Action for {selectedClient.full_name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-2">
                Notes (required for rejection)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-brand min-h-[100px]"
                placeholder="Add notes about this decision..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedClient.id)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "✓ Approve"}
              </button>
              <button
                onClick={() => handleReject(selectedClient.id)}
                disabled={isLoading || !actionNotes}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "✗ Reject"}
              </button>
              <button
                onClick={() => {
                  setSelectedClient(null);
                  setActionNotes("");
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-panel border border-border text-muted rounded-lg hover:text-text transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
