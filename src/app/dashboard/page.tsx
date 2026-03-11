"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { api, DashboardStats, ActivityItem } from "@/lib/api";

export default function DashboardPage() {
  const { user, isRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getActivity()])
      .then(([s, a]) => {
        setStats(s as DashboardStats);
        setActivity(a as ActivityItem[]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
      </div>
    );
  }

  const greeting = user ? `Welcome back, ${user.firstName}` : 'Welcome back';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgb(220,38,38) 0%, rgb(249,115,22) 100%)" }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">{greeting} 👋</h2>
            <p className="text-white/75 mt-1 text-sm">
              {isRole('ADMIN', 'HR') && `You have ${stats?.pendingLeaves ?? 0} pending leave requests to review.`}
              {isRole('MANAGER') && `${stats?.pendingApprovals ?? 0} team requests need your attention.`}
              {isRole('EMPLOYEE') && `You have ${stats?.pendingLeaves ?? 0} pending leave requests.`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs mb-1">{user?.role}</div>
            <div className="text-white font-semibold text-sm">{user?.department?.name || 'No Department'}</div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isRole('ADMIN', 'HR') && stats && (
          <>
            <StatCard label="Total Employees" value={stats.totalEmployees ?? 0} icon="👤" color="blue" />
            <StatCard label="Present Today" value={stats.presentToday ?? 0} icon="✅" color="green" />
            <StatCard label="On Leave" value={stats.onLeaveToday ?? 0} icon="🌴" color="orange" />
            <StatCard label="Pending Leaves" value={stats.pendingLeaves ?? 0} icon="⏳" color="red" />
          </>
        )}
        {isRole('MANAGER') && stats && (
          <>
            <StatCard label="Team Size" value={stats.teamSize ?? 0} icon="👥" color="blue" />
            <StatCard label="Present Today" value={stats.teamPresent ?? 0} icon="✅" color="green" />
            <StatCard label="On Leave" value={stats.teamOnLeave ?? 0} icon="🌴" color="orange" />
            <StatCard label="Pending Approvals" value={stats.pendingApprovals ?? 0} icon="⏳" color="red" />
          </>
        )}
        {isRole('EMPLOYEE') && stats && (
          <>
            <StatCard label="Leaves Used" value={stats.leavesUsedThisYear ?? 0} icon="📅" color="blue" />
            <StatCard label="Pending Requests" value={stats.pendingLeaves ?? 0} icon="⏳" color="orange" />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction href="/dashboard/attendance" icon="🕐" label="Mark Attendance" />
          {isRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN') && (
            <QuickAction href="/dashboard/attendance" icon="🌴" label="Apply Leave" />
          )}
          <QuickAction href="/dashboard/directory" icon="👥" label="View Directory" />
          {isRole('MANAGER', 'HR', 'ADMIN') && (
            <QuickAction href="/dashboard/approvals" icon="✅" label="Review Approvals" />
          )}
          {isRole('ADMIN') && (
            <QuickAction href="/dashboard/users" icon="⚙️" label="Manage Users" />
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Activity</h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm shrink-0">
                  {item.type === 'leave' ? '🌴' : '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: 'blue' | 'green' | 'orange' | 'red' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${colors[color]}`}>{icon}</div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-red-100 transition-all flex flex-col items-center gap-2 text-center group">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">{label}</span>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
