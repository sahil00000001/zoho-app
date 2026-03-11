"use client";
import Link from "next/link";

const kpis = [
  { label: "Present Today", value: "142", icon: "🟢", sub: "94% attendance rate", color: "rgb(220,38,38)" },
  { label: "On Leave", value: "8", icon: "🏖", sub: "3 approved today", color: "rgb(249,115,22)" },
  { label: "Pending Approvals", value: "3", icon: "⏳", sub: "Needs your action", color: "rgb(220,38,38)" },
  { label: "Total Employees", value: "150", icon: "👥", sub: "2 joined this month", color: "rgb(249,115,22)" },
];

const recentActivity = [
  { user: "Alice Johnson", action: "Marked attendance", time: "2 min ago", avatar: "AJ" },
  { user: "Bob Smith", action: "Requested 2 days leave", time: "15 min ago", avatar: "BS" },
  { user: "Carol Davis", action: "Uploaded employment contract", time: "1 hr ago", avatar: "CD" },
  { user: "Dave Wilson", action: "Submitted expense report", time: "2 hr ago", avatar: "DW" },
  { user: "Eve Martinez", action: "Leave approved by manager", time: "3 hr ago", avatar: "EM" },
];

const leaveBalance = [
  { type: "Casual", used: 4, total: 12 },
  { type: "Sick", used: 2, total: 8 },
  { type: "Annual", used: 8, total: 20 },
  { type: "Maternity", used: 0, total: 90 },
];

const upcomingLeaves = [
  { name: "Riya Kapoor", dates: "Mar 15–17", type: "Annual", status: "Approved" },
  { name: "Tom Hughes", dates: "Mar 18", type: "Sick", status: "Pending" },
  { name: "Anika Singh", dates: "Mar 20–25", type: "Annual", status: "Approved" },
];

const quickActions = [
  { label: "Mark Attendance", href: "/dashboard/attendance", icon: "🕐" },
  { label: "Apply Leave", href: "/dashboard/attendance", icon: "📅" },
  { label: "View Directory", href: "/dashboard/directory", icon: "👥" },
  { label: "Upload Document", href: "/dashboard/documents", icon: "📄" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>
        <div>
          <h2 className="text-2xl font-black mb-1">Good morning, Alex 👋</h2>
          <p className="text-white/80 text-sm">You have 3 pending approvals and 2 team members on leave today.</p>
        </div>
        <Link href="/dashboard/approvals" className="bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-white/20 shrink-0">
          Review Approvals →
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <div className="text-2xl">{k.icon}</div>
              <div className="h-1.5 w-12 rounded-full" style={{ background: `linear-gradient(90deg, ${k.color}, rgb(249,115,22))` }} />
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs font-semibold text-gray-700">{k.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((q) => (
          <Link key={q.label} href={q.href}
            className="glass-card rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group border border-gray-100">
            <span className="text-xl">{q.icon}</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:gradient-text">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <span className="text-xs font-medium" style={{ color: "rgb(220,38,38)" }}>View all →</span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((a) => (
              <div key={a.user} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800"><span className="font-semibold">{a.user}</span> {a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave balance */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">My Leave Balance</h3>
            <Link href="/dashboard/attendance" className="text-xs font-medium" style={{ color: "rgb(220,38,38)" }}>Apply →</Link>
          </div>
          <div className="space-y-4">
            {leaveBalance.map((l) => (
              <div key={l.type}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{l.type}</span>
                  <span className="text-xs text-gray-500">{l.used} / {l.total} days</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(l.used / l.total) * 100}%`, background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming leaves */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Upcoming Team Leaves</h3>
          <Link href="/dashboard/attendance" className="text-xs font-medium" style={{ color: "rgb(220,38,38)" }}>View calendar →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Employee", "Dates", "Type", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcomingLeaves.map((l, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
                        {l.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{l.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-sm text-gray-600">{l.dates}</td>
                  <td className="py-3 pr-6">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.08)", color: "rgb(220,38,38)" }}>
                      {l.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${l.status === "Approved" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
