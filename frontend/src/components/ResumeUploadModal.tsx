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
      setSuccess('Resume uploaded and text extracted successfully!');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Upload PDF Resume</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Uploading resume for candidate <span className="font-semibold text-slate-800">{candidateName}</span>.
        </p>

        <form onSubmit={handleUpload} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
              {success}
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-500 transition cursor-pointer relative bg-slate-50">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-teal-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : 'Choose a PDF file or drag & drop'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 10 MB'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Extracting Text...</span>
                </>
              ) : (
                'Upload & Extract'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
