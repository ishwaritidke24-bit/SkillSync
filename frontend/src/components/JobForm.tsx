'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateJobPayload, JobStatus } from '../types';

interface JobFormProps {
  initialData?: {
    title: string;
    description: string;
    requiredSkills: string[];
    experienceMin: number;
    experienceMax: number;
    status?: JobStatus;
  };
  onSubmit: (data: CreateJobPayload) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

export function JobForm({ initialData, onSubmit, submitButtonText, isSubmitting }: JobFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [skillsInput, setSkillsInput] = useState(initialData?.requiredSkills?.join(', ') || '');
  const [experienceMin, setExperienceMin] = useState<number | string>(
    initialData?.experienceMin !== undefined ? initialData.experienceMin : 0
  );
  const [experienceMax, setExperienceMax] = useState<number | string>(
    initialData?.experienceMax !== undefined ? initialData.experienceMax : 3
  );
  const [status, setStatus] = useState<JobStatus>(initialData?.status || 'active');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please enter a job title');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a job description');
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setErrorMessage('Please enter at least one required skill (separated by commas)');
      return;
    }

    const minExp = Number(experienceMin);
    const maxExp = Number(experienceMax);

    if (isNaN(minExp) || minExp < 0) {
      setErrorMessage('Minimum experience must be a non-negative number');
      return;
    }

    if (isNaN(maxExp) || maxExp < 0) {
      setErrorMessage('Maximum experience must be a non-negative number');
      return;
    }

    if (maxExp < minExp) {
      setErrorMessage('Maximum experience must be greater than or equal to minimum experience');
      return;
    }

    try {
      await onSubmit({
        title,
        description,
        requiredSkills: skills,
        experienceMin: minExp,
        experienceMax: maxExp,
        status,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving the job');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 flex items-start gap-2.5">
          <svg className="w-4 h-4 flex-shrink-0 text-burgundy mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-mono">{errorMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Position Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Senior Machine Learning Engineer"
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-semibold text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Specification & Responsibilities *
        </label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detail core duties, architectural scope, and domain expectations..."
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
          required
        />
      </div>

      {/* Required Skills */}
      <div>
        <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Mandatory Competencies (Comma-separated) *
        </label>
        <input
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="TypeScript, Python, PyTorch, Distributed Systems"
          className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 placeholder:text-charcoal-600/50 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
          required
        />
        <p className="mt-1 text-[11px] font-mono text-charcoal-600">
          Enter skills separated by commas. These form the benchmark for Gemini AI resume claim screening.
        </p>
      </div>

      {/* Experience Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
            Minimum Experience (Years) *
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={experienceMin}
            onChange={(e) => setExperienceMin(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
            required
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
            Maximum Experience (Years) *
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={experienceMax}
            onChange={(e) => setExperienceMax(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-tinted border border-border-luxury rounded-xl text-sm font-mono text-plum-950 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
            required
          />
        </div>
      </div>

      {/* Status (Only in edit/when provided) */}
      <div>
        <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
          Position Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className="w-full sm:w-60 px-4 py-2.5 bg-neutral-tinted border border-border-luxury rounded-xl text-xs font-mono font-semibold uppercase text-plum-950 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
        >
          <option value="active">ACTIVE (OPEN FOR CANDIDATES)</option>
          <option value="deactivated">DEACTIVATED (ARCHIVED)</option>
        </select>
      </div>

      {/* Actions */}
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
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitButtonText}</span>
          )}
        </button>
      </div>
    </form>
  );
}
