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
      name: 'Overview',
      href: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Positions',
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
      name: 'Applications',
      href: '/applications',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col md:flex-row">
      {/* DESKTOP EDITORIAL SIDEBAR (248px) */}
      <aside className="hidden md:flex flex-col w-[248px] bg-surface border-r border-border-neutral flex-shrink-0 h-screen sticky top-0 z-40 select-none">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center border-b border-border-neutral">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <SignalLogo size={26} theme="light" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-text-primary uppercase letter-spacing-wide">
                SkillSync
              </span>
              <span className="text-[10px] text-text-secondary tracking-tight font-medium -mt-0.5">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-3 space-y-1">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">
              Navigation
            </span>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-soft-violet text-brand font-semibold shadow-subtle'
                    : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
                }`}
              >
                <span className={isActive ? 'text-brand' : 'text-text-secondary'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Evidence Lens Shortcut Banner */}
        <div className="p-3 mx-3 mb-4 rounded-xl bg-gradient-to-br from-void to-void-panel text-white p-3.5 border border-void-border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-ion-cyan animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-ion-cyan">
              Evidence Lens
            </span>
          </div>
          <p className="text-[11px] text-text-lens-muted leading-tight">
            Cinematic AI screening active for reviewed applicants.
          </p>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-border-neutral bg-surface-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {user?.name || 'Recruiter'}
                </p>
                <p className="text-[10px] text-text-secondary truncate">
                  {user?.role || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-white rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR (md:hidden) */}
      <div className="md:hidden bg-surface border-b border-border-neutral px-4 h-16 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <SignalLogo size={24} theme="light" />
          <span className="font-bold text-sm tracking-tight text-text-primary uppercase">
            SkillSync
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {headerAction}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-text-primary rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border-neutral p-4 space-y-2 sticky top-16 z-30 shadow-card">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-canvas"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-border-neutral flex items-center justify-between">
            <span className="text-xs text-text-secondary">{user?.name} ({user?.role})</span>
            <button
              onClick={logout}
              className="text-xs text-brand font-semibold underline"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DESKTOP TOP BAR (64px) */}
        <header className="hidden md:flex h-16 bg-surface/80 backdrop-blur-md border-b border-border-neutral px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary/70">
              SkillSync Platform
            </span>
            <span className="text-border-neutral">•</span>
            <span className="text-xs font-medium text-text-secondary">
              Recruitment Intelligence, Connected.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {headerAction}
            <div className="h-4 w-px bg-border-neutral" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-soft-mint text-emerald-800 border border-emerald-200/50">
                Live System
              </span>
              <span className="text-xs font-medium text-text-secondary">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
