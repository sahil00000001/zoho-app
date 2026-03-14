"use client";
import { useEffect, useState, useCallback } from "react";
import { api, CustomRole, AppModule } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const BASE_PERMISSION_LEVELS = [
  { value: "EMPLOYEE", label: "Employee", desc: "Basic access — can view own data only" },
  { value: "MANAGER",  label: "Manager",  desc: "Can view team data + approve requests" },
  { value: "HR",       label: "HR",       desc: "Can manage users, assets, holidays" },
  { value: "ADMIN",    label: "Admin",    desc: "Full system access" },
];

const PRESET_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#dc2626"];

export default function RolesPage() {
  const { isRole } = useAuth();
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "", description: "", basePermissionLevel: "EMPLOYEE", color: "#6366f1", moduleKeys: [] as string[],
  });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, m] = await Promise.all([api.getRoles(), api.getModules()]);
      setRoles(r);
      setModules(m);
    } catch { showToast("Failed to load roles", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setForm({ name: "", description: "", basePermissionLevel: "EMPLOYEE", color: "#6366f1", moduleKeys: [] });
    setSelectedRole(null);
    setShowCreate(true);
  }

  function openEdit(role: CustomRole) {
    setForm({
      name: role.name,
      description: role.description || "",
      basePermissionLevel: role.basePermissionLevel,
      color: role.color,
      moduleKeys: role.modulePermissions.filter(p => p.canAccess).map(p => p.moduleKey),
    });
    setSelectedRole(role);
    setShowCreate(true);
  }

  function toggleModule(key: string) {
    setForm(f => ({
      ...f,
      moduleKeys: f.moduleKeys.includes(key)
        ? f.moduleKeys.filter(k => k !== key)
        : [...f.moduleKeys, key],
    }));
  }

  function selectAll() { setForm(f => ({ ...f, moduleKeys: modules.map(m => m.key) })); }
  function clearAll() { setForm(f => ({ ...f, moduleKeys: [] })); }

  async function handleSave() {
    if (!form.name.trim()) return showToast("Role name is required", "error");
    if (form.moduleKeys.length === 0) return showToast("Select at least one module", "error");
    setSaving(true);
    try {
      if (selectedRole) {
        await api.updateRole(selectedRole.id, form);
        showToast("Role updated successfully");
      } else {
        await api.createRole(form);
        showToast("Role created successfully");
      }
      setShowCreate(false);
      load();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Save failed", "error");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteRole(id);
      showToast("Role deleted");
      setDeleteConfirm(null);
      load();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Delete failed", "error");
      setDeleteConfirm(null);
    }
  }

  async function handleSeed() {
    try {
      await api.seedRoles();
      showToast("System roles seeded");
      load();
    } catch { showToast("Seed failed", "error"); }
  }

  if (!isRole("ADMIN")) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="text-4xl">🔒</span>
        <p className="text-gray-500 font-medium">Only Admins can manage roles</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-fade-in-up ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓ " : "✗ "}{toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create roles and control which modules each role can access</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSeed} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Seed System Roles
          </button>
          <button onClick={openCreate} className="gradient-btn px-4 py-2 rounded-xl text-sm font-bold text-white">
            + New Role
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-48 skeleton" />)}
        </div>
      ) : roles.length === 0 ? (
        <div className="card flex flex-col items-center justify-center h-48 gap-3">
          <span className="text-4xl">🔑</span>
          <p className="text-gray-500">No roles yet. Create one or seed system defaults.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(role => {
            const grantedModules = role.modulePermissions.filter(p => p.canAccess);
            return (
              <div key={role.id} className="card card-interactive p-5 flex flex-col gap-3 animate-fade-in-up">
                {/* Role header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0"
                    style={{ background: role.color }}>
                    {role.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{role.name}</h3>
                      {role.isSystem && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">System</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{role.description || "No description"}</p>
                  </div>
                </div>

                {/* Base permission */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Base API level:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: role.color }}>
                    {role.basePermissionLevel}
                  </span>
                </div>

                {/* Module chips */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">
                    {grantedModules.length} of {modules.length} modules enabled
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {modules.map(m => {
                      const granted = grantedModules.some(p => p.moduleKey === m.key);
                      return (
                        <span key={m.key}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${granted ? "text-white" : "bg-gray-100 text-gray-400"}`}
                          style={granted ? { background: role.color } : {}}>
                          {m.icon} {m.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Users count */}
                <div className="text-xs text-gray-400">
                  {role._count?.users ?? 0} user{(role._count?.users ?? 0) !== 1 ? "s" : ""} assigned
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <button onClick={() => openEdit(role)}
                    className="flex-1 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit
                  </button>
                  {!role.isSystem && (
                    <button onClick={() => setDeleteConfirm(role.id)}
                      className="flex-1 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-black text-lg text-gray-900">
                {selectedRole ? "Edit Role" : "Create New Role"}
              </h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name + Color */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Role Name *</label>
                  <input className="input w-full" placeholder="e.g. Recruitment Team" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                        className={`w-6 h-6 rounded-lg transition-transform ${form.color === c ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <input className="input w-full" placeholder="Describe what this role does..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Base permission level */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Base API Permission Level *</label>
                <p className="text-xs text-gray-400 mb-2">Controls what backend actions this role can perform</p>
                <div className="grid grid-cols-2 gap-2">
                  {BASE_PERMISSION_LEVELS.map(level => (
                    <button key={level.value}
                      onClick={() => setForm(f => ({ ...f, basePermissionLevel: level.value }))}
                      disabled={!!(selectedRole?.isSystem)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${form.basePermissionLevel === level.value ? "border-current" : "border-gray-200 hover:border-gray-300"}`}
                      style={form.basePermissionLevel === level.value ? { borderColor: form.color, background: form.color + "15" } : {}}>
                      <div className="font-bold text-sm text-gray-900">{level.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Module access */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700">Module Access *</label>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-xs text-blue-600 hover:underline">Select all</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={clearAll} className="text-xs text-red-500 hover:underline">Clear all</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {modules.map(m => {
                    const checked = form.moduleKeys.includes(m.key);
                    return (
                      <button key={m.key} onClick={() => toggleModule(m.key)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${checked ? "border-current text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        style={checked ? { borderColor: form.color, background: form.color } : {}}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "border-white bg-white/30" : "border-gray-300"}`}>
                          {checked && <span className="text-white text-[10px] font-black">✓</span>}
                        </div>
                        <span className="text-xs font-medium truncate">{m.icon} {m.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">{form.moduleKeys.length} of {modules.length} modules selected</p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
                style={{ background: form.color }}>
                {saving ? "Saving..." : selectedRole ? "Save Changes" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-scale-in text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Delete Role?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone. Roles with assigned users cannot be deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
