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
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Alex Morgan"
          className="mt-1 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="e.g. alex.morgan@example.com"
          className="mt-1 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 012-3456"
          className="mt-1 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="skills" className="block text-sm font-semibold text-slate-700">
          Skills (comma-separated) *
        </label>
        <p className="text-xs text-slate-500 mb-1">e.g. Python, Django, React, AWS, Docker</p>
        <input
          id="skills"
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          required
          placeholder="React, TypeScript, Node.js"
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Experience */}
      <div>
        <label htmlFor="experienceYears" className="block text-sm font-semibold text-slate-700">
          Years of Experience *
        </label>
        <input
          id="experienceYears"
          type="number"
          min={0}
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          required
          className="mt-1 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium shadow-sm transition disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
