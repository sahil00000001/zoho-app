"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/attendance": "Attendance & Leave",
  "/dashboard/directory": "Employee Directory",
  "/dashboard/approvals": "Approval Workflows",
  "/dashboard/documents": "Organization Documents",
};

export default function TopBar() {
  const path = usePathname();
  const title = titles[path] ?? "Dashboard";
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 w-48">
          <span className="text-gray-400 text-sm">🔍</span>
          <input className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none flex-1" placeholder="Search..." />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <span className="text-sm">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "rgb(220,38,38)" }} />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-sm text-gray-900">Notifications</span>
                <span className="text-xs font-medium" style={{ color: "rgb(220,38,38)" }}>Mark all read</span>
              </div>
              {[
                { msg: "Bob requested 2 days leave", time: "2m ago", read: false },
                { msg: "3 approvals pending your review", time: "15m ago", read: false },
                { msg: "Monthly report is ready", time: "1h ago", read: true },
              ].map((n, i) => (
                <div key={i} className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${n.read ? "opacity-60" : ""}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-gray-300" : ""}`} style={!n.read ? { background: "rgb(220,38,38)" } : {}} />
                  <div>
                    <p className="text-sm text-gray-700">{n.msg}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
            AK
          </div>
        </Link>
      </div>
    </header>
  );
}
