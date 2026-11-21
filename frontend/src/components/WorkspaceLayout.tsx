'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { SignalLogo } from './SignalLogo';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function WorkspaceLayout({ children, headerAction }: WorkspaceLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Executive Overview',
      href: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      ),
    },
    {
      name: 'Position Matrix',
      href: '/jobs',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Talent Pool',
      href: '/candidates',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Pipeline & Evidence',
      href: '/applications',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-transparent">
      {/* Dynamic Multi-Tone Chromatic Atmosphere Behind All Content */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Lavender Zone (Top-Right) */}
        <div className="absolute -top-32 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-lavender/35 via-plum-300/20 to-transparent blur-3xl animate-synapse-glow" />
        {/* Warm Muted Rose Zone (Mid-Left) */}
        <div className="absolute top-1/4 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-magenta-rose/25 via-burgundy-soft/30 to-transparent blur-3xl" />
        {/* Soft Pale Mauve & Plum Undertone Zone (Bottom-Right) */}
        <div className="absolute -bottom-40 right-1/4 w-[800px] h-[700px] rounded-full bg-gradient-to-tl from-plum-600/15 via-royal-light/15 to-transparent blur-3xl" />
        {/* Central Champagne Shimmer */}
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[400px] bg-gradient-to-r from-champagne/10 via-lavender/10 to-transparent blur-3xl transform -rotate-12" />
      </div>

      {/* DESKTOP CHROMATIC LUXURY SIDEBAR (260px) */}
      <aside className="hidden md:flex flex-col w-[260px] bg-gradient-to-b from-[#1F102B] via-[#241333] to-[#17151F] text-lavender-soft border-r border-plum-800/40 flex-shrink-0 h-screen sticky top-0 z-40 select-none shadow-2xl">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-plum-700/30 bg-plum-950/40 backdrop-blur-md">
          <Link href="/dashboard" className="flex items-center gap-3.5 group">
            <div className="p-1.5 rounded-xl bg-plum-900/80 border border-plum-700/50 shadow-glow-violet transition-transform group-hover:scale-105">
              <SignalLogo size={24} theme="dark" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-xl tracking-wide text-white leading-none">
                SkillSync
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-widest text-magenta-rose mt-1">
                Intelligence Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-7 px-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2.5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-lavender/60">
              Workspace Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-magenta-rose animate-pulse" />
          </div>

          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-plum-700/85 to-burgundy-800/85 text-white font-semibold shadow-glow-magenta border border-magenta-muted/40'
                    : 'text-lavender/80 hover:text-white hover:bg-plum-800/40 hover:border-plum-700/30 border border-transparent'
                }`}
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-magenta-rose' : 'text-lavender/70 group-hover:text-magenta-rose'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-magenta-rose shadow-glow-rose" />
                )}
              </Link>
            );
          })}

          {/* Evidence Lens Direct Action Card */}
          <div className="pt-6 px-1">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-plum-900/90 via-burgundy-900/60 to-charcoal-950/80 border border-plum-600/30 shadow-lg relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-magenta-muted/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-lens-cyan animate-pulse" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-lens-cyan">
                  Evidence Lens
                </span>
              </div>
              <p className="text-[11px] text-lavender/70 leading-relaxed mb-3">
                Cinematic deep claim verification & Gemini AI question engine.
              </p>
              <Link
                href="/applications"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-magenta-rose hover:text-white transition-colors"
              >
                Inspect Submissions →
              </Link>
            </div>
          </div>
        </div>

        {/* User Identity / Role Footer */}
        <div className="p-4 border-t border-plum-800/40 bg-plum-950/60 backdrop-blur-md">
          {user && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-rich via-magenta-muted to-burgundy text-white flex items-center justify-center font-bold text-xs font-mono shadow-md flex-shrink-0 border border-lavender/20">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-magenta-rose font-medium uppercase">
                      {user.role}
                    </span>
                    <span className="text-lavender/30">•</span>
                    <span className="text-[10px] font-mono text-lavender/60 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out of SkillSync"
                className="p-2 text-lavender/60 hover:text-white hover:bg-plum-800/60 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE CHROMATIC HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-plum-950 via-burgundy-900 to-plum-900 text-white border-b border-plum-800/40 z-30 sticky top-0 shadow-lg">
        <div className="flex items-center gap-3">
          <SignalLogo size={24} theme="dark" />
          <span className="font-editorial text-lg tracking-wide text-white">SkillSync</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-plum-800/60 border border-plum-700/50 text-lavender"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col">
          <div className="bg-gradient-to-b from-plum-950 via-plum-900 to-charcoal-950 p-6 flex flex-col h-full border-r border-plum-700/40 w-4/5 max-w-sm">
            <div className="flex items-center justify-between pb-6 border-b border-plum-800/40">
              <div className="flex items-center gap-3">
                <SignalLogo size={24} theme="dark" />
                <span className="font-editorial text-xl text-white">SkillSync</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-lavender">
                ✕
              </button>
            </div>
            <div className="py-6 space-y-2 flex-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-plum-700 to-burgundy text-white font-semibold'
                      : 'text-lavender hover:bg-plum-800/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            {user && (
              <div className="pt-4 border-t border-plum-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] font-mono text-magenta-rose">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-burgundy-900 text-rose-300 rounded-lg border border-burgundy-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE VIEWPORT (Tinted Multi-Tone Mauve/Lavender Canvas with Radial Depth) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        {/* Top Floating Glass Command Ribbon */}
        <header className="sticky top-0 z-30 h-16 px-6 lg:px-10 bg-[#FAF2F7]/75 backdrop-blur-md border-b border-plum-200/50 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-plum-950">
              <span className="w-2 h-2 rounded-full bg-magenta-rose shadow-glow-rose"></span>
              <span className="text-charcoal-600">ENVIRONMENT:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-lavender/60 to-plum-100 text-plum-950 font-semibold border border-plum-300/40 shadow-2xs">
                INTELLIGENCE WORKSPACE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {headerAction && <div>{headerAction}</div>}
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
