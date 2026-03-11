const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getTokens() {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const { accessToken, refreshToken } = getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry && refreshToken) {
    // Try token refresh
    try {
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setTokens(data.data.accessToken, data.data.refreshToken);
        return request<T>(path, options, false);
      }
    } catch {}
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Request failed');
  return data.data as T;
}

export const api = {
  // Auth
  sendOtp: (email: string) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email: string, otp: string) =>
    request<{ accessToken: string; refreshToken: string; user: User }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),
  getMe: () => request<User>('/api/auth/me'),
  logout: () => {
    const { refreshToken } = getTokens();
    clearTokens();
    return fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  },

  // Dashboard
  getStats: () => request<DashboardStats>('/api/dashboard/stats'),
  getActivity: () => request<ActivityItem[]>('/api/dashboard/activity'),

  // Attendance
  checkIn: () => request('/api/attendance/check-in', { method: 'POST' }),
  checkOut: () => request('/api/attendance/check-out', { method: 'POST' }),
  getTodayAttendance: () => request('/api/attendance/today'),
  getAttendanceHistory: (limit?: number) =>
    request(`/api/attendance/history${limit ? `?limit=${limit}` : ''}`),
  getTeamAttendance: (date?: string) =>
    request(`/api/attendance/team${date ? `?date=${date}` : ''}`),

  // Leaves
  getMyLeaves: () => request('/api/leaves/my'),
  applyLeave: (data: ApplyLeaveData) =>
    request('/api/leaves', { method: 'POST', body: JSON.stringify(data) }),
  cancelLeave: (id: string) => request(`/api/leaves/${id}/cancel`, { method: 'PATCH' }),
  getAllLeaves: (params?: { status?: string; userId?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/api/leaves${qs ? `?${qs}` : ''}`);
  },
  approveLeave: (id: string) => request(`/api/leaves/${id}/approve`, { method: 'PATCH' }),
  rejectLeave: (id: string, reason?: string) =>
    request(`/api/leaves/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  getLeaveBalance: () => request('/api/leaves/balance/me'),
  getLeaveTypes: () => request('/api/leave-types'),

  // Users / Directory
  getUsers: (params?: { role?: string; departmentId?: string; isActive?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/api/users${qs ? `?${qs}` : ''}`);
  },
  getUser: (id: string) => request(`/api/users/${id}`),
  createUser: (data: CreateUserData) =>
    request('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: Partial<CreateUserData>) =>
    request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deactivateUser: (id: string) => request(`/api/users/${id}`, { method: 'DELETE' }),
  getDepartments: () => request('/api/users/departments'),

  // Tokens
  setTokens,
  clearTokens,
  getTokens,
};

// Types
export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';
  designation?: string;
  phoneNumber?: string;
  joiningDate?: string;
  isActive: boolean;
  department?: { id: string; name: string };
  manager?: { id: string; firstName: string; lastName: string; employeeId: string };
}

export interface DashboardStats {
  role: string;
  // Employee
  todayAttendance?: unknown;
  pendingLeaves?: number;
  leavesUsedThisYear?: number;
  // Manager
  teamSize?: number;
  teamPresent?: number;
  teamOnLeave?: number;
  pendingApprovals?: number;
  // Admin/HR
  totalEmployees?: number;
  presentToday?: number;
  onLeaveToday?: number;
  absentToday?: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  status: string;
  date: string;
}

export interface ApplyLeaveData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';
  designation?: string;
  phoneNumber?: string;
  departmentId?: string;
  managerId?: string;
  joiningDate?: string;
}
