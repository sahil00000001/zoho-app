"use client";
import Link from "next/link";
import { useState } from "react";

const steps = ["Account", "Company", "Done"];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", size: "", role: "" });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 1) { setStep(step + 1); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = "/dashboard"; }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgb(220,38,38) 0%, rgb(249,115,22) 100%)" }}>
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-white text-6xl font-black opacity-10" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}>P</div>
          ))}
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-base">P</span>
            </div>
            <span className="text-white font-black text-xl">PeopleOS</span>
          </Link>
        </div>
        <div className="relative z-10">
          <div className="text-white/60 text-sm font-medium mb-4 uppercase tracking-widest">What you get</div>
          <div className="space-y-5">
            {[
              { icon: "🕐", title: "Attendance & Leave", desc: "Real-time tracking, balance management" },
              { icon: "👥", title: "Org Directory", desc: "Rich profiles, live org chart" },
              { icon: "✅", title: "Approval Flows", desc: "Multi-step, fully configurable" },
              { icon: "📁", title: "Document Hub", desc: "Centralized, version-controlled" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{f.title}</div>
                  <div className="text-white/60 text-xs">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="glass-card rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <p className="text-white/90 text-sm italic mb-3">&ldquo;Set up in under 5 minutes. The team loved it from day one.&rdquo;</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">JD</div>
              <div>
                <div className="text-white text-xs font-semibold">Jamie D.</div>
                <div className="text-white/50 text-xs">People Ops, Series B startup</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-xl text-gray-900">People<span className="gradient-text">OS</span></span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? "text-white" : "text-gray-400 bg-gray-100"}`}
                  style={i <= step ? { background: "linear-gradient(135deg, rgb(220,38,38), rgb(249,115,22))" } : {}}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-semibold ${i === step ? "gradient-text" : "text-gray-400"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`h-0.5 w-8 rounded transition-all ${i < step ? "" : "bg-gray-200"}`} style={i < step ? { background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))" } : {}} />}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {step === 0 ? "Create your account" : "Tell us about your team"}
          </h1>
          <p className="text-gray-500 mb-8">
            {step === 0 ? "Free forever for up to 20 employees." : "Just two quick questions to get you set up."}
          </p>

          <form onSubmit={next} className="space-y-4">
            {step === 0 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                  <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jamie Davidson" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-all"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work email</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-all"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 8 characters" required minLength={8}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-all"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company name</label>
                  <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Corp" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-all"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Team size</label>
                  <select value={form.size} onChange={(e) => set("size", e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none transition-all bg-white"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}>
                    <option value="">Select team size</option>
                    <option>1–20 employees</option>
                    <option>21–50 employees</option>
                    <option>51–100 employees</option>
                    <option>101–200 employees</option>
                    <option>200+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your role</label>
                  <select value={form.role} onChange={(e) => set("role", e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none transition-all bg-white"
                    onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}>
                    <option value="">Select your role</option>
                    <option>HR Manager / People Ops</option>
                    <option>Founder / CEO</option>
                    <option>COO / Operations</option>
                    <option>Finance / Admin</option>
                    <option>Other</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))", boxShadow: "0 8px 24px rgba(220,38,38,0.25)" }}>
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Setting up your workspace...</>
              ) : step === 0 ? "Continue →" : "Create my workspace →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Already have an account? <Link href="/login" className="font-bold" style={{ color: "rgb(220,38,38)" }}>Sign in</Link></p>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">By creating an account, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
