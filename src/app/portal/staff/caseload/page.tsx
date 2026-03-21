"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Users, FileText, CheckCircle, AlertCircle, Search, Filter, MoreHorizontal, Plus } from "lucide-react";
import { useStaff } from "@/context/StaffContext";

export default function StaffDashboard() {
  const { participants } = useStaff();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Dynamic Metrics Logic
  const metrics = useMemo(() => {
    return {
      capacity: participants.length,
      active: participants.filter(c => c.status.includes('Active')).length,
      available: participants.filter(c => c.status === 'Available').length,
      pending: participants.filter(c => !c.status.includes('Active') && c.status !== 'Available').length
    };
  }, [participants]);

  // Search & Filter Logic
  const filteredCaseload = useMemo(() => {
    return participants.filter((entry: any) => {
      // 1. Filter Check
      if (activeFilter !== "All" && activeFilter !== entry.environment) return false;
      
      // 2. Search Check
      if (searchQuery.trim() === "") return true;
      const term = searchQuery.toLowerCase();
      return (
        entry.name.toLowerCase().includes(term) ||
        entry.slot.toLowerCase().includes(term) ||
        entry.status.toLowerCase().includes(term)
      );
    });
  }, [participants, searchQuery, activeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">My Caseload</h1>
          <p className="text-slate-500 mt-1">Manage and track your active capacity and client load.</p>
        </div>
        <Link href="/portal/staff/casenote/new" className="bg-teal-600 shadow-teal-600/20 shadow-lg text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 hover:shadow-teal-700/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
          <Plus className="w-5 h-5" /> New Case Note / Client
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Capacity</p>
            <p className="text-4xl font-bold text-charcoal-900">{metrics.capacity}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Cases</p>
            <p className="text-4xl font-bold text-indigo-600">{metrics.active}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Slots</p>
            <p className="text-4xl font-bold text-emerald-600">{metrics.available}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Broken/Other</p>
            <p className="text-4xl font-bold text-rose-600">{metrics.pending}</p>
          </div>
        </div>
      </div>

      {/* Caseload Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar logic implementation */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients or slots..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "A-Block", "D-Block", "J-Block"].map(filterValue => (
              <button 
                key={filterValue}
                onClick={() => setActiveFilter(filterValue)}
                className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeFilter === filterValue 
                    ? 'bg-teal-50 border-teal-200 text-teal-700' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filterValue === "All" && <Filter className="w-4 h-4" />}
                {filterValue}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic List */}
        <div className="overflow-x-auto min-h-[400px]">
          {filteredCaseload.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <Search className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-lg font-medium text-slate-600">No matching slots found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold sticky top-0 z-10">
                  <th className="px-6 py-4">Platform Slot</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden md:table-cell">Environment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCaseload.map((entry, index) => (
                  <tr 
                    key={index} 
                    className={`group transition-colors ${
                      entry.status === 'Available' ? "bg-slate-50/50" : "bg-white hover:bg-teal-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-600 whitespace-nowrap">
                      <Link href={`/portal/staff/caseload/${entry.slot}`} className="hover:text-teal-600 transition-colors underline decoration-slate-200 underline-offset-4 decoration-dashed flex items-center gap-2">
                        {entry.slot}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {entry.status === 'Available' ? (
                          <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50"></div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-medium text-xs shadow-sm shadow-teal-500/30 shrink-0">
                            {entry.name.charAt(0)}
                          </div>
                        )}
                        <span className={`font-medium text-sm ${entry.status === 'Available' ? 'text-slate-400 italic' : 'text-charcoal-900'} ${entry.status === 'Broken Platform' ? 'text-rose-600 italic' : ''}`}>
                          {entry.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        entry.status.includes('Active') 
                          ? 'bg-teal-50 text-teal-700 border-teal-200' 
                          : entry.status === 'Broken Platform'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {entry.status.includes('Active') && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5 animate-pulse"></span>}
                        {entry.status === 'Broken Platform' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                        <span className={`w-2 h-2 rounded-full border opacity-75 ${
                          entry.environment === 'A-Block' ? 'border-teal-500 bg-teal-500' :
                          entry.environment === 'D-Block' ? 'border-indigo-500 bg-indigo-500' :
                          'border-amber-500 bg-amber-500'
                        }`}></span>
                        {entry.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors focus:outline-none">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
