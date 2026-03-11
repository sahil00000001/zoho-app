"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workHours: number | null;
  status: string;
  user: { firstName: string; lastName: string; employeeId: string; department?: { name: string } };
}

export default function AttendancePage() {
  const { isRole } = useAuth();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [teamAttendance, setTeamAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [today, hist] = await Promise.all([
        api.getTodayAttendance(),
        api.getAttendanceHistory(30),
      ]);
      setTodayRecord(today as AttendanceRecord);
      setHistory(hist as AttendanceRecord[]);

      if (isRole('MANAGER', 'HR', 'ADMIN')) {
        const team = await api.getTeamAttendance();
        setTeamAttendance(team as AttendanceRecord[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isRole]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError('');
    try {
      const record = await api.checkIn();
      setTodayRecord(record as AttendanceRecord);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError('');
    try {
      const record = await api.checkOut();
      setTodayRecord(record as AttendanceRecord);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check out');
    } finally {
      setActionLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    ABSENT: 'bg-red-100 text-red-700',
    HALF_DAY: 'bg-orange-100 text-orange-700',
  };

  const fmt = (dt: string | null) => dt ? new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Today&apos;s Attendance</h3>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Check In</div>
            <div className="font-bold text-gray-900">{fmt(todayRecord?.checkInTime ?? null)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Check Out</div>
            <div className="font-bold text-gray-900">{fmt(todayRecord?.checkOutTime ?? null)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Hours</div>
            <div className="font-bold text-gray-900">{todayRecord?.workHours ? `${todayRecord.workHours}h` : '—'}</div>
          </div>
        </div>

        {todayRecord && (
          <div className="mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColors[todayRecord.status]}`}>
              {todayRecord.status}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          {!todayRecord?.checkInTime && (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-70 flex items-center gap-2 transition-all"
              style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))", boxShadow: "0 4px 12px rgba(220,38,38,0.25)" }}
            >
              {actionLoading ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : null}
              Check In
            </button>
          )}
          {todayRecord?.checkInTime && !todayRecord?.checkOutTime && (
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-70 flex items-center gap-2 transition-all"
              style={{ background: "linear-gradient(90deg, rgb(100,100,100), rgb(60,60,60))" }}
            >
              {actionLoading ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : null}
              Check Out
            </button>
          )}
          {todayRecord?.checkOutTime && (
            <div className="text-sm text-gray-500 py-2.5">Work day complete ✓</div>
          )}
        </div>
      </div>

      {/* Tabs for managers */}
      {isRole('MANAGER', 'HR', 'ADMIN') && (
        <div className="flex gap-2 border-b border-gray-200">
          {['my', 'team'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as 'my' | 'team')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors capitalize ${activeTab === t ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'my' ? 'My History' : 'Team Today'}
            </button>
          ))}
        </div>
      )}

      {/* History / Team view */}
      {(activeTab === 'my' || !isRole('MANAGER', 'HR', 'ADMIN')) && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Attendance History</h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {history.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No attendance records yet</div>
            ) : (
              history.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
                  <div className="w-12 text-xs text-gray-500 shrink-0 font-medium">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                      <span className="text-xs text-gray-500">{fmt(r.checkInTime)} → {fmt(r.checkOutTime)}</span>
                      {r.workHours && <span className="text-xs text-gray-400">{r.workHours}h</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'team' && isRole('MANAGER', 'HR', 'ADMIN') && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Team Attendance — Today</h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {teamAttendance.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No team check-ins today</div>
            ) : (
              teamAttendance.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
                    {r.user.firstName[0]}{r.user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{r.user.firstName} {r.user.lastName}</div>
                    <div className="text-xs text-gray-400">{r.user.employeeId} {r.user.department ? `· ${r.user.department.name}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                    <div className="text-xs text-gray-400 mt-0.5">{fmt(r.checkInTime)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
