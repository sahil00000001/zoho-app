"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ALL_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞", module: "dashboard" },
  { href: "/dashboard/attendance", label: "Attendance", icon: "🕐", module: "attendance" },
  { href: "/dashboard/directory", label: "Directory", icon: "👥", module: "directory" },
  { href: "/dashboard/leaves", label: "Leaves", icon: "🌿", module: "leaves" },
  { href: "/dashboard/approvals", label: "Approvals", icon: "✅", module: "approvals" },
  { href: "/dashboard/documents", label: "Documents", icon: "📁", module: "documents" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "📢", module: "announcements" },
  { href: "/dashboard/profile", label: "My Profile", icon: "👤", module: "profile" },
  { href: "/dashboard/onboarding", label: "Onboarding", icon: "🚀", module: "onboarding" },
  { href: "/dashboard/users", label: "User Management", icon: "⚙️", module: "users" },
];

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  EMPLOYEE: { label: "Employee", color: "bg-blue-100 text-blue-700" },
  MANAGER: { label: "Manager", color: "bg-green-100 text-green-700" },
  HR: { label: "HR", color: "bg-purple-100 text-purple-700" },
  ADMIN: { label: "Super Admin", color: "bg-red-100 text-red-700" },
};

export default function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, canAccess, logout } = useAuth();

  const navItems = ALL_NAV.filter((item) => canAccess(item.module));
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';
  const roleBadge = user ? ROLE_BADGES[user.role] : null;

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-56"} transition-all duration-300 flex flex-col bg-white border-r border-gray-100 shrink-0 min-h-screen sticky top-0`}
      style={{ boxShadow: "2px 0 20px rgba(0,0,0,0.04)" }}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-gray-100 ${collapsed ? "justify-center px-3" : "px-5 gap-2"}`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
          <span className="text-white font-black text-sm">P</span>
        </div>
        {!collapsed && <span className="font-black text-lg text-gray-900">People<span className="gradient-text">OS</span></span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {navItems.map((item) => {
          const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all group ${
                active ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={active ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))", boxShadow: "0 4px 12px rgba(220,38,38,0.25)" } : {}}
              title={collapsed ? item.label : ""}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && user && (
          <div className="px-2 py-2 rounded-xl mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-400 truncate">{user.designation || user.email}</div>
              </div>
            </div>
            {roleBadge && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            )}
          </div>
        )}
        {!collapsed && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-xs font-medium mb-1"
          >
            ↩ Sign out
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors text-xs"
        >
          {collapsed ? "→" : "← Collapse"}
        </button>
      </div>
    </aside>
  );
}
