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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Job Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
          Job Title *
        </label>
        <p className="text-xs text-slate-500 mb-1">e.g. Senior Full Stack Developer, Frontend Engineer</p>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Full Stack Engineer"
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
          Job Description *
        </label>
        <p className="text-xs text-slate-500 mb-1">Detailed overview of core responsibilities and role context.</p>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe the role responsibilities, key expectations, and team focus..."
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Required Skills */}
      <div>
        <label htmlFor="requiredSkills" className="block text-sm font-semibold text-slate-700">
          Required Skills *
        </label>
        <p className="text-xs text-slate-500 mb-1">Enter skills separated by commas (e.g. React, TypeScript, Node.js, MongoDB)</p>
        <input
          id="requiredSkills"
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          required
          placeholder="React, Node.js, Express, TypeScript, MongoDB"
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        />
      </div>

      {/* Experience Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="experienceMin" className="block text-sm font-semibold text-slate-700">
            Minimum Experience (Years) *
          </label>
          <input
            id="experienceMin"
            type="number"
            min={0}
            value={experienceMin}
            onChange={(e) => setExperienceMin(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="experienceMax" className="block text-sm font-semibold text-slate-700">
            Maximum Experience (Years) *
          </label>
          <input
            id="experienceMax"
            type="number"
            min={0}
            value={experienceMax}
            onChange={(e) => setExperienceMax(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-semibold text-slate-700">
          Job Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className="mt-1 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white"
        >
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
        </select>
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
