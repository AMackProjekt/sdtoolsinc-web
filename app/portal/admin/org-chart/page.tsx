export default function OrgChartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Organization Chart</h1>
        <p className="text-slate-500 text-sm mt-0.5">T.O.O.LS INC — Program Staffing Hierarchy</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-x-auto">
        <div className="min-w-[640px]">

          {/* Executive Level */}
          <div className="flex justify-center mb-2">
            <OrgNode title="Executive Director" name="Leadership" color="violet" />
          </div>

          {/* Connector down */}
          <div className="flex justify-center mb-2">
            <div className="w-px h-6 bg-slate-300" />
          </div>

          {/* Program Director */}
          <div className="flex justify-center mb-2">
            <OrgNode title="Program Director" name="Program Director" color="violet" />
          </div>

          {/* Connector down + horizontal */}
          <div className="flex justify-center mb-0">
            <div className="w-px h-6 bg-slate-300" />
          </div>
          <div className="relative flex justify-center mb-2">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-300" />
          </div>

          {/* Mid-level: Operations + Case Management Lead */}
          <div className="grid grid-cols-2 gap-6 mb-2 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-6 bg-slate-300" />
              <OrgNode title="Operations Lead" name="Operations" color="slate" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-6 bg-slate-300" />
              <OrgNode title="Case Management Lead" name="Case Management" color="teal" />
            </div>
          </div>

          {/* Connector from Case Management Lead down */}
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6">
            <div className="col-start-2 flex justify-center">
              <div className="w-px h-6 bg-slate-300" />
            </div>
          </div>

          {/* Case Managers grid */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Case Managers</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[
                "Abby","Amalia","Coco","Jonathan","Lawanda",
                "Mack","Spencer","Tey","Tonya","William",
              ].map((name) => (
                <div key={name} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-slate-300" />
                  <div className="bg-teal-50 border border-teal-200 rounded-xl px-3 py-2 text-center w-full">
                    <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm mx-auto mb-1">
                      {name[0]}
                    </div>
                    <p className="text-xs font-semibold text-teal-800">{name}</p>
                    <p className="text-[10px] text-teal-500">Case Manager</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Staff */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex justify-center mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Support & Administrative Staff</span>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { title: "Data & Compliance",  role: "Compliance Officer"   },
                { title: "Admin / Intake",      role: "Administrative Staff" },
                { title: "Outreach & Advocacy", role: "Outreach Coordinator" },
              ].map((s) => (
                <div key={s.title} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs font-bold text-slate-700">{s.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.role}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Program Locations legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { loc: "Tier 3",       color: "bg-violet-100 border-violet-200 text-violet-700", desc: "Transitional housing program" },
          { loc: "Tier 4",       color: "bg-teal-100 border-teal-200 text-teal-700",       desc: "Permanent supportive housing" },
          { loc: "B Lot",        color: "bg-amber-100 border-amber-200 text-amber-700",    desc: "Safe parking & vehicle residency" },
          { loc: "Safe Parking", color: "bg-emerald-100 border-emerald-200 text-emerald-700", desc: "Safer Cities Initiative parking" },
        ].map((p) => (
          <div key={p.loc} className={`border rounded-xl p-4 ${p.color}`}>
            <p className="font-bold text-sm">{p.loc}</p>
            <p className="text-xs mt-0.5 opacity-80">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgNode({ title, name, color }: { title: string; name: string; color: "violet" | "teal" | "slate" }) {
  const colors = {
    violet: "bg-violet-100 border-violet-300 text-violet-900",
    teal:   "bg-teal-100 border-teal-300 text-teal-900",
    slate:  "bg-slate-100 border-slate-300 text-slate-700",
  };
  return (
    <div className={`border-2 rounded-xl px-6 py-3 text-center min-w-[160px] ${colors[color]}`}>
      <p className="font-bold text-sm">{name}</p>
      <p className="text-[11px] opacity-70 mt-0.5">{title}</p>
    </div>
  );
}
