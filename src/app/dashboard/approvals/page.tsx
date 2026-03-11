"use client";
import { useState } from "react";

type Status = "pending" | "approved" | "rejected" | "all";
type ApprovalType = "leave" | "expense" | "hiring" | "document" | "custom";

interface Approval {
  id: number;
  type: ApprovalType;
  title: string;
  requestedBy: string;
  avatar: string;
  dept: string;
  date: string;
  status: Exclude<Status, "all">;
  priority: "high" | "medium" | "low";
  details: string;
  steps: { label: string; approver: string; status: "done" | "current" | "pending" }[];
}

const approvals: Approval[] = [
  {
    id: 1, type: "leave", title: "Annual Leave – 5 Days", requestedBy: "Carol Davis", avatar: "CD", dept: "Design",
    date: "Mar 12, 2026", status: "pending", priority: "high", details: "Family vacation, Mar 15–19",
    steps: [{ label: "Direct Manager", approver: "Bob Smith", status: "done" }, { label: "HR Review", approver: "Alex Kumar", status: "current" }, { label: "Final Approval", approver: "CEO", status: "pending" }],
  },
  {
    id: 2, type: "expense", title: "Conference Travel – $1,850", requestedBy: "Alice Johnson", avatar: "AJ", dept: "Engineering",
    date: "Mar 11, 2026", status: "pending", priority: "medium", details: "React Summit 2026, Barcelona",
    steps: [{ label: "Team Lead", approver: "Sarah Chen", status: "done" }, { label: "Finance", approver: "Jake Brown", status: "current" }],
  },
  {
    id: 3, type: "hiring", title: "New Hire – Senior Backend Eng", requestedBy: "Eve Martinez", avatar: "EM", dept: "Engineering",
    date: "Mar 10, 2026", status: "pending", priority: "high", details: "Headcount addition, Q2 2026",
    steps: [{ label: "Department Head", approver: "Eve Martinez", status: "done" }, { label: "HR", approver: "Alex Kumar", status: "current" }, { label: "Finance", approver: "Jake Brown", status: "pending" }, { label: "CEO", approver: "CEO", status: "pending" }],
  },
  {
    id: 4, type: "document", title: "Policy Update – Remote Work", requestedBy: "Alex Kumar", avatar: "AK", dept: "People Ops",
    date: "Mar 9, 2026", status: "approved", priority: "low", details: "Updated remote work guidelines for 2026",
    steps: [{ label: "Legal Review", approver: "Legal", status: "done" }, { label: "HR Director", approver: "Alex Kumar", status: "done" }],
  },
  {
    id: 5, type: "expense", title: "Software License – $2,400/yr", requestedBy: "Dave Wilson", avatar: "DW", dept: "Engineering",
    date: "Mar 8, 2026", status: "approved", priority: "medium", details: "Datadog APM annual subscription",
    steps: [{ label: "Engineering Lead", approver: "Sarah Chen", status: "done" }, { label: "Finance", approver: "Jake Brown", status: "done" }],
  },
  {
    id: 6, type: "leave", title: "Sick Leave – 1 Day", requestedBy: "Dave Wilson", avatar: "DW", dept: "Engineering",
    date: "Mar 13, 2026", status: "rejected", priority: "low", details: "Rejected: insufficient notice",
    steps: [{ label: "Direct Manager", approver: "Sarah Chen", status: "done" }],
  },
];

const typeConfig: Record<ApprovalType, { icon: string; label: string; color: string }> = {
  leave: { icon: "📅", label: "Leave", color: "rgb(220,38,38)" },
  expense: { icon: "💰", label: "Expense", color: "rgb(249,115,22)" },
  hiring: { icon: "🧑‍💼", label: "Hiring", color: "rgb(220,38,38)" },
  document: { icon: "📄", label: "Document", color: "rgb(249,115,22)" },
  custom: { icon: "⚡", label: "Custom", color: "rgb(220,38,38)" },
};

const priorityConfig = {
  high: { label: "High", bg: "bg-red-50", text: "text-red-600" },
  medium: { label: "Medium", bg: "bg-orange-50", text: "text-orange-500" },
  low: { label: "Low", bg: "bg-gray-100", text: "text-gray-500" },
};

export default function ApprovalsPage() {
  const [filter, setFilter] = useState<Status>("all");
  const [selected, setSelected] = useState<Approval | null>(null);
  const [items, setItems] = useState(approvals);

  const filtered = items.filter(a => filter === "all" || a.status === filter);
  const counts = { all: items.length, pending: items.filter(a => a.status === "pending").length, approved: items.filter(a => a.status === "approved").length, rejected: items.filter(a => a.status === "rejected").length };

  const act = (id: number, action: "approved" | "rejected") => {
    setItems(p => p.map(a => a.id === id ? { ...a, status: action } : a));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", val: counts.all, icon: "📋", color: "rgb(220,38,38)" },
          { label: "Pending", val: counts.pending, icon: "⏳", color: "rgb(249,115,22)" },
          { label: "Approved", val: counts.approved, icon: "✅", color: "rgb(34,197,94)" },
          { label: "Rejected", val: counts.rejected, icon: "❌", color: "rgb(107,114,128)" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-5 border border-gray-100">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs font-semibold text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as Status[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-red-200"}`}
            style={filter === f ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
            {f} {f !== "all" && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Approval cards */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const tc = typeConfig[a.type];
          const pc = priorityConfig[a.priority];
          return (
            <div key={a.id} onClick={() => setSelected(a)} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border border-gray-100 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.08), rgba(249,115,22,0.08))" }}>
                    {tc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>{pc.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{a.details}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>{a.avatar}</span>
                        {a.requestedBy}
                      </span>
                      <span>·</span>
                      <span>{a.dept}</span>
                      <span>·</span>
                      <span>{a.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.status === "pending" ? "bg-orange-50 text-orange-500" : a.status === "approved" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                  {a.status === "pending" && (
                    <div className="flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => act(a.id, "approved")} className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>Approve</button>
                      <button onClick={() => act(a.id, "rejected")} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">Reject</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval steps */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {a.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                      <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "done" ? "bg-green-50 text-green-600" : s.status === "current" ? "text-white" : "bg-gray-100 text-gray-400"}`}
                        style={s.status === "current" ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
                        {s.status === "done" ? "✓" : s.status === "current" ? "●" : "○"} {s.label}
                      </div>
                      {i < a.steps.length - 1 && <span className="text-gray-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-bold text-gray-700 text-lg mb-1">All clear!</h3>
          <p className="text-gray-400 text-sm">No {filter !== "all" ? filter : ""} approvals at the moment.</p>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-gray-900">Approval Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.08), rgba(249,115,22,0.08))" }}>
                  {typeConfig[selected.type].icon}
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">{selected.title}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">{selected.details}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selected.status === "pending" ? "bg-orange-50 text-orange-500" : selected.status === "approved" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityConfig[selected.priority].bg} ${priorityConfig[selected.priority].text}`}>
                      {priorityConfig[selected.priority].label} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Requester */}
              <div className="glass-card rounded-xl p-4 border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Requested by</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>{selected.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{selected.requestedBy}</div>
                    <div className="text-xs text-gray-400">{selected.dept} · {selected.date}</div>
                  </div>
                </div>
              </div>

              {/* Workflow steps */}
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Approval Workflow</div>
                <div className="space-y-3">
                  {selected.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${s.status === "done" ? "bg-green-100 text-green-600" : s.status === "current" ? "text-white" : "bg-gray-100 text-gray-400"}`}
                        style={s.status === "current" ? { background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
                        {s.status === "done" ? "✓" : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-semibold ${s.status === "current" ? "gradient-text" : s.status === "done" ? "text-gray-600" : "text-gray-400"}`}>{s.label}</span>
                          <span className="text-xs text-gray-400">{s.approver}</span>
                        </div>
                        <div className="h-0.5 mt-2 rounded-full" style={{ background: s.status === "done" ? "linear-gradient(90deg, rgb(34,197,94), rgb(34,197,94))" : s.status === "current" ? "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" : "#f3f4f6" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => act(selected.id, "approved")} className="flex-1 py-3 text-white font-bold rounded-xl" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>Approve</button>
                  <button onClick={() => act(selected.id, "rejected")} className="flex-1 py-3 font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
