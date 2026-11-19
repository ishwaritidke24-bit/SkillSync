'use client';

import { useState } from 'react';
import { ApiService } from '../services/api';

interface ResumeUploadModalProps {
  candidateId: string;
  candidateName: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function ResumeUploadModal({
  candidateId,
  candidateName,
  isOpen,
  onClose,
  onUploadSuccess,
}: ResumeUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const selected = e.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Only PDF documents (.pdf) are supported');
      setFile(null);
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit');
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await ApiService.uploadResume(candidateId, file);
      setSuccess('Resume document parsed and associated successfully!');
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and process resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-void/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-floating border border-border-neutral">
        <div className="flex items-center justify-between pb-3 border-b border-border-neutral">
          <div>
            <h3 className="text-base font-bold text-text-primary">Upload PDF Resume</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Candidate: <span className="font-semibold text-text-primary">{candidateName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleUpload} className="mt-5 space-y-4">
          {error && (
            <div className="p-3.5 bg-soft-coral border border-coral/30 rounded-xl text-xs text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-soft-mint border border-emerald-200 rounded-xl text-xs text-emerald-900">
              {success}
            </div>
          )}

          <div className="border-2 border-dashed border-border-neutral hover:border-brand rounded-2xl p-6 text-center transition cursor-pointer relative bg-canvas/30 group">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-soft-violet text-brand flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-text-primary">
                {file ? file.name : 'Select or drag candidate PDF'}
              </p>
              <p className="text-[11px] text-text-secondary mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF format up to 10 MB'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-neutral">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Parsing Document...</span>
                </>
              ) : (
                'Upload & Extract Text'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
