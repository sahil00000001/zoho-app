"use client";
import { useState } from "react";

const employees = [
  { id: 1, name: "Alice Johnson", role: "Frontend Engineer", avatar: "AJ", status: "present", checkIn: "9:02 AM", checkOut: null, hours: "7h 12m" },
  { id: 2, name: "Bob Smith", role: "Product Manager", avatar: "BS", status: "present", checkIn: "9:15 AM", checkOut: null, hours: "6h 59m" },
  { id: 3, name: "Carol Davis", role: "Designer", avatar: "CD", status: "leave", checkIn: null, checkOut: null, hours: "-" },
  { id: 4, name: "Dave Wilson", role: "Backend Engineer", avatar: "DW", status: "absent", checkIn: null, checkOut: null, hours: "-" },
  { id: 5, name: "Eve Martinez", role: "DevOps", avatar: "EM", status: "present", checkIn: "8:50 AM", checkOut: null, hours: "7h 24m" },
  { id: 6, name: "Frank Lee", role: "QA Engineer", avatar: "FL", status: "present", checkIn: "9:30 AM", checkOut: null, hours: "6h 44m" },
];

const leaveRequests = [
  { id: 1, name: "Carol Davis", type: "Annual", from: "Mar 13", to: "Mar 17", days: 5, status: "approved", reason: "Family vacation" },
  { id: 2, name: "Dave Wilson", type: "Sick", from: "Mar 13", to: "Mar 13", days: 1, status: "pending", reason: "Fever" },
  { id: 3, name: "Grace Kim", type: "Casual", from: "Mar 20", to: "Mar 20", days: 1, status: "pending", reason: "Personal work" },
  { id: 4, name: "Henry Park", type: "Annual", from: "Apr 1", to: "Apr 5", days: 5, status: "approved", reason: "Holiday trip" },
];

const myBalance = [
  { type: "Casual", icon: "☕", used: 4, total: 12, color: "rgb(220,38,38)" },
  { type: "Sick", icon: "🏥", used: 2, total: 8, color: "rgb(249,115,22)" },
  { type: "Annual", icon: "🏖", used: 8, total: 20, color: "rgb(220,38,38)" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date().getDay();

export default function AttendancePage() {
  const [tab, setTab] = useState<"attendance" | "leave">("attendance");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "Casual", from: "", to: "", reason: "" });

  const handleCheckIn = () => {
    setCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  return (
    <div className="space-y-6">
      {/* Check-in card */}
      <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h2 className="text-2xl font-black mb-1">{checkedIn ? `Checked in at ${checkInTime}` : "Ready to start your day?"}</h2>
            <p className="text-white/70 text-sm">{checkedIn ? "Have a productive day! 🚀" : "Mark your attendance with one click."}</p>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${checkedIn ? "bg-white/20 cursor-not-allowed" : "bg-white hover:bg-gray-50 shadow-lg hover:-translate-y-0.5"}`}
            style={checkedIn ? {} : { color: "rgb(220,38,38)" }}
          >
            {checkedIn ? "✓ Checked In" : "Check In Now"}
          </button>
        </div>

        {/* Mini week view */}
        <div className="mt-5 flex gap-2">
          {days.map((d, i) => {
            const isToday = i === (today === 0 ? 6 : today - 1);
            const isPast = i < (today === 0 ? 6 : today - 1);
            return (
              <div key={d} className={`flex-1 rounded-xl py-2 text-center text-xs font-medium transition-all ${isToday ? "bg-white" : isPast ? "bg-white/20" : "bg-white/10"}`} style={isToday ? { color: "rgb(220,38,38)" } : {}}>
                <div>{d}</div>
                {isPast && <div className="mt-1 text-white/80 text-xs">✓</div>}
                {isToday && <div className="mt-1 w-1.5 h-1.5 rounded-full mx-auto" style={{ background: "rgb(220,38,38)" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myBalance.map((b) => (
          <div key={b.type} className="glass-card rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{b.icon}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.08)", color: "rgb(220,38,38)" }}>{b.type}</span>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: b.color }}>{b.total - b.used}</div>
            <div className="text-xs text-gray-500 mb-3">days remaining</div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(b.used / b.total) * 100}%`, background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }} />
            </div>
            <div className="text-xs text-gray-400 mt-1.5">{b.used} used · {b.total} total</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {(["attendance", "leave"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
            style={tab === t ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
            {t === "attendance" ? "📋 Team Attendance" : "📅 Leave Requests"}
          </button>
        ))}
      </div>

      {tab === "attendance" && (
        <div className="glass-card rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Today&apos;s Attendance</h3>
            <div className="flex gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Present (4)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> On Leave (1)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Absent (1)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  {["Employee", "Status", "Check In", "Hours Worked", "Action"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>{e.avatar}</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{e.name}</div>
                          <div className="text-xs text-gray-400">{e.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${e.status === "present" ? "bg-green-50 text-green-600" : e.status === "leave" ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-gray-500"}`}>
                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{e.checkIn ?? "-"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{e.hours}</td>
                    <td className="px-6 py-4">
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm" style={{ borderColor: "rgba(220,38,38,0.3)", color: "rgb(220,38,38)" }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "leave" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{leaveRequests.filter(l => l.status === "pending").length} pending requests</p>
            <button onClick={() => setShowLeaveModal(true)}
              className="text-white text-sm font-bold px-5 py-2.5 rounded-xl" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>
              + Apply Leave
            </button>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    {["Employee", "Type", "Dates", "Days", "Reason", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((l) => (
                    <tr key={l.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
                            {l.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{l.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.08)", color: "rgb(220,38,38)" }}>{l.type}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{l.from} → {l.to}</td>
                      <td className="px-5 py-4 text-sm font-semibold" style={{ color: "rgb(220,38,38)" }}>{l.days}d</td>
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-32 truncate">{l.reason}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${l.status === "approved" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"}`}>
                          {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {l.status === "pending" && (
                          <div className="flex gap-2">
                            <button className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>Approve</button>
                            <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leave modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-gray-400 hover:text-gray-600 text-xl transition-colors">×</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setShowLeaveModal(false); }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Leave Type</label>
                <select value={leaveForm.type} onChange={(e) => setLeaveForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white"
                  onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}>
                  <option>Casual</option><option>Sick</option><option>Annual</option><option>Emergency</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">From</label>
                  <input type="date" value={leaveForm.from} onChange={(e) => setLeaveForm(p => ({ ...p, from: e.target.value }))} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">To</label>
                  <input type="date" value={leaveForm.to} onChange={(e) => setLeaveForm(p => ({ ...p, to: e.target.value }))} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason</label>
                <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm(p => ({ ...p, reason: e.target.value }))} placeholder="Brief reason for leave..." rows={3} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none"
                  onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-white font-bold text-sm" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
