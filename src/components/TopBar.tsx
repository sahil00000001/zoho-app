"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/attendance": "Attendance",
  "/dashboard/directory": "Directory",
  "/dashboard/approvals": "Approvals",
  "/dashboard/documents": "Documents",
  "/dashboard/users": "User Management",
};

export default function TopBar() {
  const path = usePathname();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const title = PAGE_TITLES[path] || "PeopleOS";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400 hidden sm:block">{today}</p>
      </div>

      <div className="hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-48 transition-all"
        />
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
            {initials}
          </div>
          {user && (
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-gray-400">{user.role}</div>
            </div>
          )}
          <span className="text-gray-400 text-xs">▾</span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
            <button
              onClick={() => { setShowUserMenu(false); logout(); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
