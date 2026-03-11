"use client";
import { useState } from "react";

const employees = [
  { id: 1, name: "Alex Kumar", role: "HR Manager", dept: "People Ops", email: "alex@company.com", phone: "+1 555-0101", location: "New York", joined: "Jan 2022", avatar: "AK", reports: 12, manager: null },
  { id: 2, name: "Alice Johnson", role: "Frontend Engineer", dept: "Engineering", email: "alice@company.com", phone: "+1 555-0102", location: "San Francisco", joined: "Mar 2022", avatar: "AJ", reports: 0, manager: "Sarah Chen" },
  { id: 3, name: "Bob Smith", role: "Product Manager", dept: "Product", email: "bob@company.com", phone: "+1 555-0103", location: "Austin", joined: "Feb 2021", avatar: "BS", reports: 5, manager: "Alex Kumar" },
  { id: 4, name: "Carol Davis", role: "UX Designer", dept: "Design", email: "carol@company.com", phone: "+1 555-0104", location: "Chicago", joined: "Jul 2022", avatar: "CD", reports: 2, manager: "Bob Smith" },
  { id: 5, name: "Dave Wilson", role: "Backend Engineer", dept: "Engineering", email: "dave@company.com", phone: "+1 555-0105", location: "Seattle", joined: "May 2021", avatar: "DW", reports: 0, manager: "Sarah Chen" },
  { id: 6, name: "Eve Martinez", role: "DevOps Lead", dept: "Engineering", email: "eve@company.com", phone: "+1 555-0106", location: "Remote", joined: "Sep 2020", avatar: "EM", reports: 3, manager: "Sarah Chen" },
  { id: 7, name: "Frank Lee", role: "QA Engineer", dept: "Engineering", email: "frank@company.com", phone: "+1 555-0107", location: "Boston", joined: "Nov 2022", avatar: "FL", reports: 0, manager: "Eve Martinez" },
  { id: 8, name: "Grace Kim", role: "Data Analyst", dept: "Analytics", email: "grace@company.com", phone: "+1 555-0108", location: "New York", joined: "Jun 2021", avatar: "GK", reports: 1, manager: "Alex Kumar" },
  { id: 9, name: "Henry Park", role: "Sales Manager", dept: "Sales", email: "henry@company.com", phone: "+1 555-0109", location: "Miami", joined: "Jan 2021", avatar: "HP", reports: 8, manager: "Alex Kumar" },
  { id: 10, name: "Iris Chang", role: "Marketing Lead", dept: "Marketing", email: "iris@company.com", phone: "+1 555-0110", location: "Los Angeles", joined: "Apr 2021", avatar: "IC", reports: 4, manager: "Alex Kumar" },
  { id: 11, name: "Jake Brown", role: "Finance Manager", dept: "Finance", email: "jake@company.com", phone: "+1 555-0111", location: "Dallas", joined: "Mar 2020", avatar: "JB", reports: 3, manager: "Alex Kumar" },
  { id: 12, name: "Karen White", role: "Customer Success", dept: "CS", email: "karen@company.com", phone: "+1 555-0112", location: "Denver", joined: "Aug 2021", avatar: "KW", reports: 0, manager: "Henry Park" },
];

const depts = ["All", ...Array.from(new Set(employees.map(e => e.dept)))];
const gradientColors = ["rgb(220,38,38)", "rgb(249,115,22)", "rgb(239,68,68)", "rgb(234,88,12)"];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [view, setView] = useState<"grid" | "list" | "org">("grid");
  const [selected, setSelected] = useState<typeof employees[0] | null>(null);

  const filtered = employees.filter(e =>
    (dept === "All" || e.dept === dept) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Employee Directory</h2>
          <p className="text-sm text-gray-500">{employees.length} team members across {depts.length - 1} departments</p>
        </div>
        <button className="text-white text-sm font-bold px-5 py-2.5 rounded-xl shrink-0" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>
          + Add Employee
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-200 flex-1 max-w-sm">
          <span className="text-gray-400">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or role..." className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {depts.map((d) => (
            <button key={d} onClick={() => setDept(d)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${dept === d ? "text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-red-200"}`}
              style={dept === d ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
              {d}
            </button>
          ))}
        </div>

        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl ml-auto">
          {(["grid", "list", "org"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v ? "text-white shadow-sm" : "text-gray-500"}`}
              style={view === v ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
              {v === "grid" ? "⊞" : v === "list" ? "☰" : "🌳"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((e, i) => (
            <div key={e.id} onClick={() => setSelected(e)} className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black mb-3 group-hover:scale-105 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${gradientColors[i % 2]}, ${gradientColors[1 + (i % 2)]})` }}>
                  {e.avatar}
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{e.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{e.role}</p>
                <span className="mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ background: "rgba(220,38,38,0.07)", color: "rgb(220,38,38)" }}>{e.dept}</span>
                <div className="mt-3 pt-3 border-t border-gray-100 w-full flex justify-between text-xs text-gray-400">
                  <span>📍 {e.location}</span>
                  {e.reports > 0 && <span>👥 {e.reports} reports</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="glass-card rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                {["Employee", "Department", "Location", "Joined", "Reports to", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(e)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>{e.avatar}</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{e.name}</div>
                        <div className="text-xs text-gray-400">{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(220,38,38,0.07)", color: "rgb(220,38,38)" }}>{e.dept}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{e.location}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{e.joined}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{e.manager ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all" style={{ borderColor: "rgba(220,38,38,0.3)", color: "rgb(220,38,38)" }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Org chart view */}
      {view === "org" && (
        <div className="glass-card rounded-2xl p-8 border border-gray-100">
          <div className="flex flex-col items-center">
            {/* CEO node */}
            <OrgNode name="Alex Kumar" role="HR Manager" avatar="AK" color="rgb(220,38,38)" />
            <div className="w-0.5 h-8" style={{ background: "linear-gradient(180deg, rgb(220,38,38), rgb(249,115,22))" }} />
            {/* Second level */}
            <div className="flex flex-wrap justify-center gap-6 relative">
              {[
                { name: "Bob Smith", role: "Product Manager", avatar: "BS" },
                { name: "Eve Martinez", role: "DevOps Lead", avatar: "EM" },
                { name: "Henry Park", role: "Sales Manager", avatar: "HP" },
                { name: "Iris Chang", role: "Marketing Lead", avatar: "IC" },
              ].map((e) => (
                <div key={e.name} className="flex flex-col items-center">
                  <div className="w-0.5 h-6" style={{ background: "linear-gradient(180deg, rgb(249,115,22), rgb(220,38,38))" }} />
                  <OrgNode name={e.name} role={e.role} avatar={e.avatar} color="rgb(249,115,22)" small />
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">Showing simplified org chart · Click employees for full chart</p>
        </div>
      )}

      {/* Employee drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-gray-900">Employee Profile</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl transition-colors w-8 h-8 flex items-center justify-center">×</button>
            </div>

            <div className="p-6">
              {/* Profile header */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
                  {selected.avatar}
                </div>
                <h2 className="text-xl font-black text-gray-900">{selected.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{selected.role}</p>
                <span className="mt-2 text-xs font-medium px-3 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.08)", color: "rgb(220,38,38)" }}>{selected.dept}</span>
              </div>

              {/* Details */}
              <div className="py-5 space-y-4">
                {[
                  { label: "Email", value: selected.email, icon: "✉️" },
                  { label: "Phone", value: selected.phone, icon: "📞" },
                  { label: "Location", value: selected.location, icon: "📍" },
                  { label: "Joined", value: selected.joined, icon: "📅" },
                  { label: "Manager", value: selected.manager ?? "—", icon: "👤" },
                  { label: "Direct Reports", value: String(selected.reports), icon: "👥" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-base">{d.icon}</span>
                    <div>
                      <div className="text-xs text-gray-400">{d.label}</div>
                      <div className="text-sm font-medium text-gray-800">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl" style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" }}>Send Message</button>
                <button className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrgNode({ name, role, avatar, color, small }: { name: string; role: string; avatar: string; color: string; small?: boolean }) {
  return (
    <div className={`flex flex-col items-center glass-card rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all cursor-pointer ${small ? "w-32" : "w-40"}`}>
      <div className={`${small ? "w-10 h-10 text-sm" : "w-12 h-12 text-base"} rounded-xl flex items-center justify-center text-white font-black mb-2`}
        style={{ background: `linear-gradient(135deg, ${color}, rgb(249,115,22))` }}>
        {avatar}
      </div>
      <div className={`font-bold text-gray-900 text-center ${small ? "text-xs" : "text-sm"}`}>{name}</div>
      <div className="text-xs text-gray-400 text-center mt-0.5">{role}</div>
    </div>
  );
}
