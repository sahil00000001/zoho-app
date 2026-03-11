"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgb(220,38,38) 0%, rgb(249,115,22) 100%)" }}
      >
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
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
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Your team&apos;s HR,<br />simplified.
          </h2>
          <p className="text-white/75 text-lg leading-relaxed mb-10">
            Manage attendance, leaves, approvals, and docs — all in one place.
          </p>

          <div className="space-y-4">
            {[
              { icon: "✓", text: "One-click attendance tracking" },
              { icon: "✓", text: "Smart leave management" },
              { icon: "✓", text: "Instant approval workflows" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {item.icon}
                </div>
                <span className="text-white/85 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["SC", "MW", "PN", "AK"].map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-white text-xs font-bold">{a}</div>
            ))}
          </div>
          <p className="text-white/70 text-sm">Trusted by 12,000+ employees</p>
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your PeopleOS account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: "rgba(220,38,38,0.3)" } as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium" style={{ color: "rgb(220,38,38)" }}>Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-all pr-12"
                  onFocus={(e) => e.target.style.borderColor = "rgb(220,38,38)"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg, rgb(220,38,38), rgb(249,115,22))", boxShadow: loading ? "none" : "0 8px 24px rgba(220,38,38,0.25)" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : "Sign in →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold" style={{ color: "rgb(220,38,38)" }}>Create one free</Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>🔒</span>
              <span>256-bit encrypted · SOC 2 compliant · GDPR ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
