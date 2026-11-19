import React from 'react';

interface SignalLogoProps {
  className?: string;
  size?: number;
  theme?: 'light' | 'dark';
}

/**
 * The Signal – SkillSync Brand Symbol (Chromatic Luxury Edition)
 * Three connected intelligence nodes: Candidate Evidence (Rose Gold / Cyan),
 * Job Requisite (Plum / Burgundy), and AI Analysis (Royal Purple / Violet)
 * meeting at an illuminated central nexus.
 */
export function SignalLogo({ className = '', size = 28, theme = 'light' }: SignalLogoProps) {
  const isDark = theme === 'dark';

  const nodeColorA = isDark ? '#CB9FF3' : '#7550A8'; // Royal Violet
  const nodeColorB = isDark ? '#D58B9B' : '#A74778'; // Muted Magenta / Rose Accent
  const nodeColorC = isDark ? '#D7BEA0' : '#54243F'; // Champagne / Deep Burgundy
  const centerColor = isDark ? '#FFFFFF' : '#241333'; // Signal Core
  const lineColor = isDark ? 'rgba(216, 199, 235, 0.35)' : 'rgba(84, 36, 63, 0.25)';
  const glowFilter = isDark ? 'url(#chromaDarkGlow)' : 'url(#chromaLightGlow)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 transition-transform duration-300 hover:rotate-6 ${className}`}
      aria-label="SkillSync Signal"
    >
      <defs>
        <filter id="chromaDarkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="chromaLightGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="signalPlumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7550A8" />
          <stop offset="50%" stopColor="#A74778" />
          <stop offset="100%" stopColor="#54243F" />
        </linearGradient>
      </defs>

      {/* Outer subtle orbital ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke={lineColor}
        strokeWidth="1"
        strokeDasharray="2 3"
      />

      {/* Connecting coordinate chords */}
      <line x1="16" y1="5.5" x2="16" y2="16" stroke={lineColor} strokeWidth="1.25" />
      <line x1="6.5" y1="23.5" x2="16" y2="16" stroke={lineColor} strokeWidth="1.25" />
      <line x1="25.5" y1="23.5" x2="16" y2="16" stroke={lineColor} strokeWidth="1.25" />

      {/* Outer Triangle connecting points */}
      <polygon
        points="16,5.5 25.5,23.5 6.5,23.5"
        stroke={lineColor}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />

      {/* Point 1: Candidate Evidence (Top) */}
      <circle cx="16" cy="5.5" r="3" fill={nodeColorA} filter={glowFilter} />
      <circle cx="16" cy="5.5" r="1.2" fill="#FFFFFF" />

      {/* Point 2: Job Architecture (Bottom Right) */}
      <circle cx="25.5" cy="23.5" r="3" fill={nodeColorB} filter={glowFilter} />
      <circle cx="25.5" cy="23.5" r="1.2" fill="#FFFFFF" />

      {/* Point 3: Intelligence Nexus (Bottom Left) */}
      <circle cx="6.5" cy="23.5" r="3" fill={nodeColorC} filter={glowFilter} />
      <circle cx="6.5" cy="23.5" r="1.2" fill="#FFFFFF" />

      {/* Central Intersection: The Insight Signal Core */}
      <circle
        cx="16"
        cy="16"
        r="4"
        fill={centerColor}
        stroke="url(#signalPlumGrad)"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="16" r="1.5" fill="#D58B9B" />
    </svg>
  );
}
