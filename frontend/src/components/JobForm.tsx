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
        <div className="p-4 bg-soft-coral border border-coral/30 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
          <svg className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Job Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Job Position Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Senior Full Stack Engineer"
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Role Overview & Description *
        </label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Outline the mission, technical stack, core responsibilities, and team expectations..."
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition leading-relaxed"
        />
      </div>

      {/* Required Skills */}
      <div>
        <label htmlFor="requiredSkills" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Required Competencies & Skills *
        </label>
        <p className="text-xs text-text-secondary mb-2">
          Enter comma-separated skills for automated Evidence Lens matching (e.g. TypeScript, React, Node.js, MongoDB)
        </p>
        <input
          id="requiredSkills"
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          required
          placeholder="React, TypeScript, Node.js, MongoDB, Express"
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        />
      </div>

      {/* Experience Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="experienceMin" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            Minimum Experience (Years) *
          </label>
          <input
            id="experienceMin"
            type="number"
            min={0}
            value={experienceMin}
            onChange={(e) => setExperienceMin(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
          />
        </div>
        <div>
          <label htmlFor="experienceMax" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            Maximum Experience (Years) *
          </label>
          <input
            id="experienceMax"
            type="number"
            min={0}
            value={experienceMax}
            onChange={(e) => setExperienceMax(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Posting Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className="w-full px-3.5 py-2.5 bg-canvas/40 border border-border-neutral rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
        >
          <option value="active">Active (Accepting Applicants)</option>
          <option value="deactivated">Deactivated (Closed to Pipeline)</option>
        </select>
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
          {isSubmitting ? 'Processing...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
