"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { LogOut, Search, Plus, Save, X, Trash2 } from "lucide-react";

const LOCATIONS = ["Tier 3", "Tier 4", "B Lot", "Safe Parking"] as const;
type Location = (typeof LOCATIONS)[number];

const EXIT_REASONS = [
  "Stably Housed",
  "Program Completion",
  "Voluntary Exit",
  "Rule Violation / Termination",
  "Medical / Health",
  "Incarceration",
  "Deceased",
  "Unknown",
  "Other",
];

const CASE_MANAGERS = [
  "Abby", "Coco", "Jonathan", "Mack", "Spencer", "Tonya",
];

const LOCATION_COLORS: Record<string, string> = {
  "Tier 3":       "bg-violet-100 text-violet-700 border-violet-200",
  "Tier 4":       "bg-teal-100 text-teal-700 border-teal-200",
  "B Lot":        "bg-amber-100 text-amber-700 border-amber-200",
  "Safe Parking": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const REASON_COLORS: Record<string, string> = {
  "Stably Housed":               "bg-emerald-100 text-emerald-700",
  "Program Completion":          "bg-blue-100 text-blue-700",
  "Voluntary Exit":              "bg-sky-100 text-sky-700",
  "Rule Violation / Termination":"bg-rose-100 text-rose-700",
  "Medical / Health":            "bg-orange-100 text-orange-700",
  "Incarceration":               "bg-red-100 text-red-700",
  "Deceased":                    "bg-slate-200 text-slate-600",
  "Unknown":                     "bg-slate-100 text-slate-500",
  "Other":                       "bg-slate-100 text-slate-500",
};

type Exit = {
  _id: Id<"exits">;
  slot: string;
  clientName: string;
  location: string;
  exitDate: string;
  exitReason: string;
  exitDestination?: string;
  caseManager: string;
  notes?: string;
};

const EMPTY_FORM = {
  slot: "",
  clientName: "",
  location: "Tier 3" as Location,
  exitDate: new Date().toISOString().slice(0, 10),
  exitReason: "",
  exitDestination: "",
  caseManager: "",
  notes: "",
};

export default function ExitsPage() {
  const rawExits = useQuery(api.functions.listExits) ?? [];
  const exits = rawExits as Exit[];
  const addExit    = useMutation(api.functions.addExit);
  const deleteExit = useMutation(api.functions.deleteExit);

  const [activeLocation, setActiveLocation] = useState<Location | "All">("All");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Get current month for monthly counts
  const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const counts = LOCATIONS.reduce<Record<string, number>>((acc, loc) => {
    acc[loc] = exits.filter((e) => e.location === loc && e.exitDate.startsWith(thisMonth)).length;
    return acc;
  }, {});

  const filtered = exits.filter((e) => {
    const matchLoc    = activeLocation === "All" || e.location === activeLocation;
    const matchSearch = !search || e.clientName.toLowerCase().includes(search.toLowerCase()) ||
      e.slot.toLowerCase().includes(search.toLowerCase());
    return matchLoc && matchSearch;
  });

  async function handleAdd() {
    if (!form.slot || !form.clientName || !form.exitReason || !form.caseManager) return;
    setSaving(true);
    try {
      await addExit({
        slot: form.slot,
        clientName: form.clientName,
        location: form.location,
        exitDate: form.exitDate,
        exitReason: form.exitReason,
        exitDestination: form.exitDestination || undefined,
        caseManager: form.caseManager,
        notes: form.notes || undefined,
      });
      setForm(EMPTY_FORM);
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-rose-500" /> Program Exits
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Exit records per location — showing this month&apos;s counts on cards
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
        >
          <Plus className="w-4 h-4" /> Record Exit
        </button>
      </div>

      {/* Per-location KPI cards (this month) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocation(activeLocation === loc ? "All" : loc)}
            className={`text-left p-4 rounded-xl border-2 transition-all shadow-sm ${
              activeLocation === loc
                ? "border-rose-400 bg-rose-50"
                : "border-transparent bg-white hover:border-slate-200"
            }`}
          >
            <p className="text-3xl font-black text-slate-800">{counts[loc]}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${LOCATION_COLORS[loc]}`}>
              {loc}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">exits this month</p>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex flex-wrap items-center gap-6 text-sm">
        <span className="font-semibold text-slate-700">
          Total Exits: <span className="text-rose-600">{exits.length}</span>
        </span>
        {EXIT_REASONS.slice(0, 3).map((r) => (
          <span key={r} className="text-slate-500">
            {r}: {exits.filter(e => e.exitReason === r).length}
          </span>
        ))}
        <span className="ml-auto text-slate-400">{exits.length} total records</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slot…"
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(["All", ...LOCATIONS] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc as Location | "All")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeLocation === loc
                  ? "bg-rose-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Slot", "Client Name", "Location", "Exit Date", "Reason", "Destination", "Case Manager", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No exits recorded yet. Use &quot;Record Exit&quot; to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 font-medium">{e.slot}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{e.clientName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${LOCATION_COLORS[e.location] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {e.location}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{e.exitDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${REASON_COLORS[e.exitReason] ?? "bg-slate-100 text-slate-600"}`}>
                        {e.exitReason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{e.exitDestination ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{e.caseManager}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteExit({ id: e._id })}
                        className="p-1 text-slate-400 hover:text-rose-500 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Exit Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800 text-lg">Record Program Exit</h2>
              <button onClick={() => setAdding(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Slot / UID *</label>
                  <input
                    value={form.slot}
                    onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value }))}
                    placeholder="e.g. A1"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Client Name *</label>
                  <input
                    value={form.clientName}
                    onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                    placeholder="Full name"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Location *</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value as Location }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                  >
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Exit Date</label>
                  <input
                    type="date"
                    value={form.exitDate}
                    onChange={(e) => setForm((f) => ({ ...f, exitDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Exit Reason *</label>
                <select
                  value={form.exitReason}
                  onChange={(e) => setForm((f) => ({ ...f, exitReason: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                >
                  <option value="">Select reason…</option>
                  {EXIT_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Exit Destination (if known)</label>
                <input
                  value={form.exitDestination}
                  onChange={(e) => setForm((f) => ({ ...f, exitDestination: e.target.value }))}
                  placeholder="e.g. Shelter X, Family, VASH Housing…"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Case Manager *</label>
                <select
                  value={form.caseManager}
                  onChange={(e) => setForm((f) => ({ ...f, caseManager: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                >
                  <option value="">Select case manager…</option>
                  {CASE_MANAGERS.map((cm) => <option key={cm}>{cm}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !form.slot || !form.clientName || !form.exitReason || !form.caseManager}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Record Exit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
