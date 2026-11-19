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
        <div className="p-4 bg-soft-coral border border-coral/30 rounded-xl text-xs text-red-800">
          {errorMessage}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Candidate Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Alex Morgan"
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="alex.morgan@example.com"
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 012-3456"
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="skills" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Core Competencies (Comma-separated) *
        </label>
        <p className="text-xs text-text-secondary mb-2">
          List stated technical and professional capabilities (e.g. React, Node.js, Python, AWS)
        </p>
        <input
          id="skills"
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          required
          placeholder="React, TypeScript, Node.js, MongoDB"
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Experience */}
      <div>
        <label htmlFor="experienceYears" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Years of Verified Experience *
        </label>
        <input
          id="experienceYears"
          type="number"
          min={0}
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-neutral">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 border border-border-neutral rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-canvas transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-brand hover:bg-brand-hover active:bg-brand-active text-white rounded-xl text-xs font-semibold shadow-subtle transition disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
