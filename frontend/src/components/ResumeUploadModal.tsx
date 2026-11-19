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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-luxury-elevated border border-border-luxury animate-in fade-in zoom-in-95 duration-150 relative">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

        <div className="flex items-center justify-between pb-3 border-b border-border-luxury">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-plum-950">Attach PDF Resume</h3>
            <p className="text-xs font-mono text-charcoal-600 mt-0.5">
              Candidate: <span className="font-semibold text-plum-950">{candidateName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal-600 hover:text-plum-950 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleUpload} className="mt-5 space-y-4">
          {error && (
            <div className="p-3.5 bg-burgundy-soft border border-burgundy-700/30 rounded-xl text-xs text-burgundy-950 font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-plum-100 border border-plum-200 rounded-xl text-xs text-plum-900 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-magenta-rose animate-pulse" />
              <span>{success}</span>
            </div>
          )}

          {/* Drag & Drop Styled Zone */}
          <div className="relative border-2 border-dashed border-border-luxury hover:border-plum-400 bg-neutral-tinted/60 rounded-2xl p-6 text-center transition">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-border-luxury flex items-center justify-center text-plum">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs font-mono font-semibold text-plum-950">
                {file ? file.name : 'Click or drop PDF document here'}
              </p>
              <p className="text-[11px] font-mono text-charcoal-600">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 10MB'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-luxury">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-semibold text-charcoal-600 hover:bg-neutral-tinted rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-5 py-2 bg-gradient-to-r from-plum to-burgundy hover:opacity-95 text-white text-xs font-mono uppercase font-semibold rounded-xl shadow-glow-magenta transition disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Parsing Claims...</span>
                </>
              ) : (
                <span>Upload & Ingest</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
