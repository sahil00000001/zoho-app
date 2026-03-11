"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/attendance", label: "Attendance", icon: "🕐" },
  { href: "/dashboard/directory", label: "Directory", icon: "👥" },
  { href: "/dashboard/approvals", label: "Approvals", icon: "✅" },
  { href: "/dashboard/documents", label: "Documents", icon: "📁" },
];

export default function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
        {!collapsed && (
          <span className="font-black text-lg text-gray-900">People<span className="gradient-text">OS</span></span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {nav.map((item) => {
          const active = path === item.href;
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
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer mb-2 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
              AK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">Alex Kumar</div>
              <div className="text-xs text-gray-400 truncate">HR Manager</div>
            </div>
            <span className="text-gray-400 text-xs">⚙</span>
          </div>
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
