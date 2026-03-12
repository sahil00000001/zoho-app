"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ALL_NAV = [
  { href: "/dashboard",               label: "Dashboard",      icon: "⊞",  module: "dashboard" },
  { href: "/dashboard/attendance",    label: "Attendance",     icon: "🕐",  module: "attendance" },
  { href: "/dashboard/leaves",        label: "Leaves",         icon: "🌿",  module: "leaves" },
  { href: "/dashboard/announcements", label: "Announcements",  icon: "📢",  module: "announcements" },
  { href: "/dashboard/directory",     label: "Directory",      icon: "👥",  module: "directory" },
  { href: "/dashboard/profile",       label: "My Profile",     icon: "👤",  module: "profile" },
  { href: "/dashboard/onboarding",    label: "Onboarding",     icon: "🚀",  module: "onboarding" },
  { href: "/dashboard/approvals",     label: "Approvals",      icon: "✅",  module: "approvals" },
  { href: "/dashboard/documents",     label: "Documents",      icon: "📁",  module: "documents" },
  { href: "/dashboard/users",         label: "User Management",icon: "⚙️",  module: "users" },
];

const ROLE_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  EMPLOYEE: { label: "Employee",   bg: "bg-blue-100",   text: "text-blue-700" },
  MANAGER:  { label: "Manager",    bg: "bg-green-100",  text: "text-green-700" },
  HR:       { label: "HR",         bg: "bg-purple-100", text: "text-purple-700" },
  ADMIN:    { label: "Super Admin",bg: "bg-red-100",    text: "text-red-700" },
};

const NAV_GROUPS = [
  { label: "Main", items: ["dashboard", "attendance", "leaves", "announcements"] },
  { label: "Team", items: ["directory", "profile", "onboarding", "approvals"] },
  { label: "Admin", items: ["documents", "users"] },
];

export default function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, canAccess, logout } = useAuth();

  const visibleNav = ALL_NAV.filter(item => canAccess(item.module));
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U";
  const badge = user ? ROLE_BADGES[user.role] : null;

  function isActive(href: string) {
    return href === "/dashboard" ? path === href : path.startsWith(href);
  }

  function getGroupItems(modules: string[]) {
    return visibleNav.filter(n => modules.includes(n.module));
  }

  return (
    <aside
      className={`${collapsed ? "w-[60px]" : "w-[220px]"} transition-all duration-300 ease-in-out flex flex-col bg-white shrink-0 min-h-screen sticky top-0 z-30`}
      style={{ borderRight: "1px solid #e9ecef", boxShadow: "2px 0 16px rgba(0,0,0,0.04)" }}
    >
      {/* Logo */}
      <div className={`h-14 flex items-center shrink-0 border-b border-gray-100 ${collapsed ? "justify-center px-3" : "px-4 gap-2.5"}`}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}
        >
          <span className="text-white font-black text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="font-black text-base text-gray-900 tracking-tight">
            People<span className="gradient-text">OS</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map(group => {
          const items = getGroupItems(group.items);
          if (items.length === 0) return null;
          return (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <div className="px-2 mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.label}</span>
                </div>
              )}
              {items.map(item => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl mb-0.5 text-sm font-medium transition-all group relative ${
                      active
                        ? "text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    style={active ? {
                      background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))",
                      boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
                    } : {}}
                  >
                    <span className={`text-base shrink-0 transition-transform ${!active && "group-hover:scale-110"}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate text-[13px]">{item.label}</span>
                    )}
                    {active && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 p-2 border-t border-gray-100">
        {!collapsed && user && (
          <div className="mb-2 px-2 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-default">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-900 truncate leading-none mb-0.5">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[11px] text-gray-400 truncate">{user.designation || user.email}</div>
              </div>
            </div>
            {badge && (
              <div className="mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
              </div>
            )}
          </div>
        )}

        {!collapsed && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-xs font-medium mb-1"
          >
            <span>↩</span>
            <span>Sign out</span>
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
