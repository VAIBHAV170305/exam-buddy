import React from 'react';
import { X, Download, FileText, Bookmark, Calendar } from 'lucide-react';
import { documentsAPI } from '../services/api';

export default function DocViewerModal({ doc, onClose, onBookmarkToggle }) {
  if (!doc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Document Preview"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold uppercase text-xs">
              {doc.file_type}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">{doc.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Subject: <strong className="text-slate-700">{doc.subject}</strong></span>
                <span>•</span>
                <span>Folder: <strong className="text-slate-700">{doc.category_folder}</strong></span>
                <span>•</span>
                <span>{doc.page_count} Pages</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmarkToggle(doc.id, !doc.is_bookmarked)}
              aria-label={doc.is_bookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
              className={`p-2 rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 ${
                doc.is_bookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
              }`}
              title={doc.is_bookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
            >
              <Bookmark className={`w-4 h-4 ${doc.is_bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
            <a
              href={documentsAPI.downloadUrl(doc.id)}
              target="_blank"
              rel="noreferrer"
              aria-label="Download original document file"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors border border-slate-300 focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              aria-label="Close document preview"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {doc.summary && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                Executive AI Summary
              </h4>
              <p className="text-sm text-indigo-950 leading-relaxed">{doc.summary}</p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Extracted Document Text
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {doc.extracted_text || 'No readable text content extracted.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Uploaded on {new Date(doc.created_at).toLocaleDateString()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
