import React from 'react';

interface SignalLogoProps {
  className?: string;
  size?: number;
  theme?: 'light' | 'dark';
}

/**
 * The Signal – SkillSync Brand Symbol
 * Three connected points (Candidate, Job, AI Intelligence)
 * meeting at a central intersection representing Recruitment Insight.
 */
export function SignalLogo({ className = '', size = 28, theme = 'light' }: SignalLogoProps) {
  const isDark = theme === 'dark';

  const nodeColorA = isDark ? '#A78BFA' : '#5949D6'; // AI Intelligence (Violet)
  const nodeColorB = isDark ? '#65E7DA' : '#0D9488'; // Candidate Evidence (Cyan)
  const nodeColorC = isDark ? '#C9F36A' : '#10B981'; // Job Matching (Lime/Green)
  const centerColor = isDark ? '#FFFFFF' : '#171923'; // The Signal Insight
  const lineColor = isDark ? 'rgba(233, 234, 255, 0.25)' : 'rgba(89, 73, 214, 0.2)';

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
      {/* Outer subtle orbital ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke={lineColor}
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.7"
      />

      {/* Triad Connection Lines to Center */}
      <line x1="16" y1="6" x2="16" y2="16" stroke={nodeColorA} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7.34" y1="21" x2="16" y2="16" stroke={nodeColorB} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24.66" y1="21" x2="16" y2="16" stroke={nodeColorC} strokeWidth="1.5" strokeLinecap="round" />

      {/* Point 1: AI Intelligence (Top) */}
      <circle cx="16" cy="6" r="3" fill={nodeColorA} />
      <circle cx="16" cy="6" r="1.2" fill={isDark ? '#090B14' : '#FFFFFF'} />

      {/* Point 2: Candidate Evidence (Bottom-Left) */}
      <circle cx="7.34" cy="21" r="3" fill={nodeColorB} />
      <circle cx="7.34" cy="21" r="1.2" fill={isDark ? '#090B14' : '#FFFFFF'} />

      {/* Point 3: Job Requirements (Bottom-Right) */}
      <circle cx="24.66" cy="21" r="3" fill={nodeColorC} />
      <circle cx="24.66" cy="21" r="1.2" fill={isDark ? '#090B14' : '#FFFFFF'} />

      {/* Central Insight Intersection */}
      <circle cx="16" cy="16" r="2.2" fill={centerColor} />
    </svg>
  );
}
