'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCandidatePayload } from '../types';

interface CandidateFormProps {
  initialData?: {
    name: string;
    email: string;
    phone?: string;
    skills: string[];
    experienceYears: number;
  };
  onSubmit: (data: CreateCandidatePayload) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

export function CandidateForm({
  initialData,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: CandidateFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [skillsInput, setSkillsInput] = useState(initialData?.skills?.join(', ') || '');
  const [experienceYears, setExperienceYears] = useState<number | string>(
    initialData?.experienceYears !== undefined ? initialData.experienceYears : 0
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Candidate name is required');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Candidate email is required');
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setErrorMessage('Please provide at least one skill');
      return;
    }

    const exp = Number(experienceYears);
    if (isNaN(exp) || exp < 0) {
      setErrorMessage('Experience years must be a non-negative number');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        skills,
        experienceYears: exp,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save candidate');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 font-mono">
          {errorMessage}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Candidate Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Alex Morgan"
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-semibold text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Direct Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="alex.morgan@domain.com"
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Contact Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 019-2834"
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
        />
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="skills" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Stated Skills (Comma-separated) *
        </label>
        <input
          id="skills"
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          required
          placeholder="e.g. React, Node.js, TypeScript, GraphQL, AWS"
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
        />
        <p className="mt-1 text-[11px] font-mono text-charcoal-600">
          Enter candidate competencies separated by commas.
        </p>
      </div>

      {/* Experience Years */}
      <div>
        <label htmlFor="experienceYears" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Total Years of Professional Experience *
        </label>
        <input
          id="experienceYears"
          type="number"
          min="0"
          max="50"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          required
          className="w-full sm:w-48 px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-luxury">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-border-luxury text-xs font-mono font-semibold text-charcoal-600 hover:bg-neutral-tinted transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-plum via-burgundy to-royal hover:opacity-95 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl shadow-glow-magenta transition disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Dossier...</span>
            </>
          ) : (
            <span>{submitButtonText}</span>
          )}
        </button>
      </div>
    </form>
  );
}
