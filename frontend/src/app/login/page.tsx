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
    <div className="min-h-screen bg-canvas flex flex-col justify-between relative overflow-hidden selection:bg-lavender selection:text-plum-950">
      {/* Chromatic Luxury Ambient Glow Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-plum-600/15 via-burgundy-700/15 to-transparent rounded-full blur-3xl animate-synapse-glow" />
        <div className="absolute -bottom-32 -left-32 w-[650px] h-[650px] bg-gradient-to-tr from-violet-rich/15 via-magenta-muted/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[300px] bg-gradient-to-r from-champagne-soft/20 via-rose-accent/10 to-transparent blur-2xl transform -rotate-45" />
      </div>

      {/* Top Header Ribbon */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-plum-900 border border-plum-700/50 shadow-glow-violet">
            <SignalLogo size={28} theme="dark" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-2xl tracking-wide text-plum-950 font-bold leading-none">
              SkillSync
            </span>
            <span className="font-mono text-[10px] text-magenta-muted tracking-widest uppercase font-semibold mt-1">
              Chromatic Intelligence
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-tinted border border-border-luxury shadow-luxury-subtle">
          <span className="w-2 h-2 rounded-full bg-magenta-rose animate-pulse" />
          <span className="font-mono text-[11px] font-medium text-charcoal-700">
            Auth Nexus v1.0 • Live Atlas Secure
          </span>
        </div>
      </header>

      {/* Center Layout: Chromatic Editorial Split */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Editorial Left Hero Narrative (Finaura x Vaultflow styling) */}
          <div className="lg:col-span-7 space-y-7 lg:pr-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-plum-100 via-magenta-soft to-lavender-soft border border-plum-200/60 text-plum-900 text-xs font-semibold shadow-luxury-subtle">
              <span className="w-2 h-2 rounded-full bg-magenta-vivid shadow-glow-rose" />
              <span className="font-mono tracking-wider text-[11px] uppercase">
                Synapse × Finaura × Vaultflow
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-plum-950 tracking-tight leading-[1.08]">
              Where recruitment intuition meets{' '}
              <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-plum via-burgundy to-magenta-vivid">
                chromatic intelligence.
              </span>
            </h1>

            <p className="text-base text-charcoal-700 leading-relaxed max-w-xl font-normal">
              SkillSync unifies talent evidence, position specifications, and multi-dimensional Gemini screening into an art-directed intelligence environment. Transition between intuitive pipeline workflows and the deep cinematic Evidence Lens.
            </p>

            {/* Visual Value Metrics Grid with Burgundy/Rose Gradient Accents */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-border-luxury">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-plum-100 shadow-luxury-subtle">
                <span className="font-editorial text-3xl text-plum-900 block leading-tight">
                  3-Way
                </span>
                <p className="font-mono text-[10px] uppercase text-charcoal-600 mt-1">
                  Signal Graph Model
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-plum-900 via-burgundy-900 to-charcoal-950 text-white shadow-luxury-card border border-plum-700/50">
                <span className="font-editorial text-3xl text-magenta-rose block leading-tight">
                  Lens AI
                </span>
                <p className="font-mono text-[10px] uppercase text-lavender/80 mt-1">
                  Cinematic Verification
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-plum-100 shadow-luxury-subtle">
                <span className="font-editorial text-3xl text-burgundy-800 block leading-tight">
                  100%
                </span>
                <p className="font-mono text-[10px] uppercase text-charcoal-600 mt-1">
                  Human Authority
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Chromatic Luxury Sign-In Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-border-luxury-strong p-8 sm:p-9 shadow-luxury-elevated relative overflow-hidden">
              {/* Subtle Card Accent Gradient Header Bar */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

              <div className="mb-6">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-magenta-muted">
                  Restricted Access
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-plum-950 mt-1">
                  Access SkillSync
                </h2>
                <p className="text-xs text-charcoal-600 mt-1">
                  Authenticate with authorized Admin or Recruiter credentials.
                </p>
              </div>

              {(formError || authError) && (
                <div className="mb-6 p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 flex items-start gap-2.5 shadow-sm">
                  <span className="font-mono font-bold text-burgundy-700 text-sm">!</span>
                  <div className="flex-1 font-medium">{formError || authError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-plum-900 mb-1.5">
                    Account Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recruiter@skillsync.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm text-plum-950 placeholder-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-plum-900">
                      Security Key
                    </label>
                    <span className="font-mono text-[10px] text-charcoal-600">Encrypted</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm text-plum-950 placeholder-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-plum via-burgundy to-royal text-white font-medium text-xs tracking-wider uppercase font-mono rounded-xl shadow-glow-magenta hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <span>Enter Chromatic Intelligence →</span>
                  )}
                </button>
              </form>

              {/* 1-Click Fast-Track Credentials */}
              <div className="mt-8 pt-6 border-t border-border-luxury">
                <span className="font-mono text-[10px] uppercase font-semibold text-charcoal-600 tracking-wider block mb-2.5">
                  Pre-Seeded Security Keys (Atlas Database)
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('admin@skillsync.com', 'Admin@123')}
                    className="p-2.5 text-left rounded-xl bg-neutral-tinted hover:bg-plum-100/60 border border-border-luxury transition text-xs group"
                  >
                    <div className="font-bold text-plum-950 group-hover:text-plum font-mono flex items-center justify-between">
                      <span>ADMIN</span>
                      <span className="text-[10px] text-magenta-muted">Auto-fill</span>
                    </div>
                    <div className="text-[11px] text-charcoal-600 truncate mt-0.5">
                      admin@skillsync.com
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickAccount('recruiter@skillsync.com', 'Recruiter@123')}
                    className="p-2.5 text-left rounded-xl bg-neutral-tinted hover:bg-burgundy-soft/60 border border-border-luxury transition text-xs group"
                  >
                    <div className="font-bold text-plum-950 group-hover:text-burgundy font-mono flex items-center justify-between">
                      <span>RECRUITER</span>
                      <span className="text-[10px] text-magenta-muted">Auto-fill</span>
                    </div>
                    <div className="text-[11px] text-charcoal-600 truncate mt-0.5">
                      recruiter@skillsync.com
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="relative z-10 p-6 text-center text-xs font-mono text-charcoal-600">
        SkillSync Recruitment Intelligence Platform • Atlas Database Verified • Google Gemini Engine
      </footer>
    </div>
  );
}
