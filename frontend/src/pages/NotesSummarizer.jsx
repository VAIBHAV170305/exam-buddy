import React, { useState, useEffect } from 'react';
import { summarizerAPI, documentsAPI } from '../services/api';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Download,
  BookOpen,
  ListOrdered,
  BookCheck,
  Binary
} from 'lucide-react';

const SUMMARY_TYPES = [
  { id: 'bullet_points', title: 'Concise Bullet Points', desc: 'Core takeaways grouped by topic', icon: ListOrdered },
  { id: 'chapter_wise', title: 'Chapter-Wise Digest', desc: 'Hierarchical breakdown with subheadings', icon: BookOpen },
  { id: 'quick_revision', title: 'Quick Revision Sheet', desc: 'High-yield points & memory mnemonics', icon: BookCheck },
  { id: 'formulas_definitions', title: 'Formulas & Definitions', desc: 'Exact rules, theorems & equations', icon: Binary },
];

export default function NotesSummarizer() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [customText, setCustomText] = useState('');
  const [summaryType, setSummaryType] = useState('bullet_points');
  const [loading, setLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const res = await documentsAPI.list();
      setDocuments(res.data);
      if (res.data.length > 0) {
        setSelectedDocId(res.data[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummaryResult(null);

    try {
      const payload = {
        summary_type: summaryType,
      };
      if (selectedDocId && selectedDocId !== 'custom') {
        payload.document_id = parseInt(selectedDocId);
      } else {
        payload.custom_text = customText;
      }

      const res = await summarizerAPI.summarize(payload);
      setSummaryResult(res.data);
    } catch (err) {
      console.error("Summarization error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summaryResult?.summary) {
      navigator.clipboard.writeText(summaryResult.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-brand-600" />
          <span>AI Notes Summarizer</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Distill lengthy lecture notes, PDFs, and chapters into revision bullet points, formulas, and cheat sheets.
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSummarize} className="space-y-5">
          {/* Document Source Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="summarizer-doc-select" className="block text-xs font-bold text-slate-800 mb-1.5">
                Select Uploaded Document
              </label>
              <select
                id="summarizer-doc-select"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    📄 {d.title} ({d.subject} • {d.page_count}p)
                  </option>
                ))}
                <option value="custom">✍️ Or paste custom study text below</option>
              </select>
            </div>

            <div>
              <label htmlFor="summarizer-type-select" className="block text-xs font-bold text-slate-800 mb-1.5">
                Target Output Format
              </label>
              <select
                id="summarizer-type-select"
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {SUMMARY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Text Area if selected */}
          {selectedDocId === 'custom' && (
            <div>
              <label htmlFor="summarizer-custom-text" className="block text-xs font-bold text-slate-800 mb-1">
                Paste Course Notes / Lecture Content
              </label>
              <textarea
                id="summarizer-custom-text"
                rows={5}
                required
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste paragraphs, article text, or syllabus points here..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Summary Type Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUMMARY_TYPES.map((t) => {
              const Icon = t.icon;
              const isSelected = summaryType === t.id;
              return (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSummaryType(t.id);
                    }
                  }}
                  onClick={() => setSummaryType(t.id)}
                  aria-label={`Select summary format: ${t.title}`}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    isSelected
                      ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-500'}`} aria-hidden="true" />
                  <h4 className="text-xs font-bold">{t.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-tight">{t.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || (selectedDocId === 'custom' && !customText.trim())}
              aria-label="Generate AI summary from study materials"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <span>{loading ? 'Synthesizing Summary...' : 'Generate AI Summary'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>

      {/* Summary Loading */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">
            Extracting core definitions, chapter themes, and formulas...
          </p>
        </div>
      )}

      {/* Summary Output */}
      {summaryResult && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                Style: {summaryResult.summary_type.replace('_', ' ')}
              </span>
              <h2 className="text-lg font-bold text-slate-900">{summaryResult.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy AI summary to clipboard"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-600 text-xs font-semibold flex items-center gap-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-8 prose-sm max-w-none text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
            {summaryResult.summary}
          </div>
        </div>
      )}
    </div>
  );
}
