'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SignalLogo } from '../../components/SignalLogo';

export default function LoginPage() {
  const { login, loading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your email.');
      return;
    }

    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    await login(email, password);
  };

  const fillQuickAccount = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between selection:bg-soft-violet selection:text-brand">
      {/* Top Subtle Brand Bar */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <SignalLogo size={32} theme="light" />
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-text-primary uppercase">
              SkillSync
            </span>
            <span className="text-[11px] text-text-secondary font-medium tracking-tight">
              Recruitment Intelligence, Connected.
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-text-secondary">Security Protocol v1.0</span>
        </div>
      </header>

      {/* Center Layout: Editorial Split / Hero */}
      <main className="flex-1 flex items-center justify-center p-6 my-4">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Editorial Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-6 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-violet text-brand text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Editorial Workspace × Cinematic Intelligence
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
              Recruitment decisions rooted in <span className="text-brand">connected evidence</span>.
            </h1>

            <p className="text-base text-text-secondary leading-relaxed max-w-xl">
              SkillSync connects candidates, vacancies, and Gemini AI analysis within a dual-world workspace. From intuitive pipeline administration to deep-dive Evidence Lens screening.
            </p>

            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-border-neutral">
              <div>
                <span className="text-2xl font-bold text-text-primary">3-Way</span>
                <p className="text-xs text-text-secondary mt-0.5">Signal Architecture</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-brand">Dark Mode</span>
                <p className="text-xs text-text-secondary mt-0.5">Evidence Lens AI</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-text-primary">100%</span>
                <p className="text-xs text-text-secondary mt-0.5">Human Authority</p>
              </div>
            </div>
          </div>

          {/* Right Card: The Clean Login Box */}
          <div className="lg:col-span-5">
            <div className="bg-surface rounded-2xl border border-border-neutral p-8 shadow-card relative">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-text-primary">Sign in to SkillSync</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Admin & Recruiter credential authentication
                </p>
              </div>

              {(formError || authError) && (
                <div className="mb-5 p-3.5 bg-soft-coral border border-coral/30 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{formError || authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Authorized Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@skillsync.com"
                    className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover active:bg-brand-active shadow-subtle transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying credentials...</span>
                      </>
                    ) : (
                      'Sign In to Workspace'
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Fill Credentials Bar */}
              <div className="mt-6 pt-5 border-t border-border-neutral">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary text-center mb-2.5">
                  Pre-configured Accounts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('admin@skillsync.com', 'Admin@123456')}
                    className="px-2.5 py-2 text-xs font-medium text-text-primary bg-canvas hover:bg-border-neutral/60 rounded-lg border border-border-neutral transition text-center"
                  >
                    Admin Account
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('recruiter@skillsync.com', 'Recruiter@123456')}
                    className="px-2.5 py-2 text-xs font-medium text-text-primary bg-canvas hover:bg-border-neutral/60 rounded-lg border border-border-neutral transition text-center"
                  >
                    Recruiter Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="p-6 text-center text-xs text-text-secondary max-w-7xl mx-auto w-full border-t border-border-neutral/60">
        SkillSync Platform • Built with Next.js, Express, MongoDB Atlas & Google Gemini AI.
      </footer>
    </div>
  );
}
