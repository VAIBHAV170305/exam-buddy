import React, { useState, useEffect } from 'react';
import { ragAPI, documentsAPI } from '../services/api';
import DocViewerModal from '../components/DocViewerModal';
import {
  BookOpenCheck,
  Search,
  BookOpen,
  FileText,
  Send,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function PdfTutorRag() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [question, setQuestion] = useState("What is deadlock, and what are its four necessary conditions?");
  const [learningMode, setLearningMode] = useState('exam_prep');
  const [loading, setLoading] = useState(false);
  const [ragResponse, setRagResponse] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const res = await documentsAPI.list();
      setDocuments(res.data);
      if (res.data.length > 0) {
        setSelectedDocIds([res.data[0].id]);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setRagResponse(null);

    try {
      const payload = {
        question: question.trim(),
        document_ids: selectedDocIds.length > 0 ? selectedDocIds : null,
        learning_mode: learningMode,
        top_k: 4,
      };

      const res = await ragAPI.query(payload);
      setRagResponse(res.data);
    } catch (err) {
      console.error("RAG query failed:", err);
      setRagResponse({
        answer: "⚠️ Could not retrieve answer from documents. Please check that you have uploaded lecture notes.",
        citations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const openDocPreview = async (docId) => {
    try {
      const res = await documentsAPI.get(docId);
      setPreviewDoc(res.data);
    } catch (err) {
      console.error("Failed to fetch doc details:", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <BookOpenCheck className="w-6 h-6 text-brand-600" />
          <span>AI PDF Tutor (RAG-Based)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ask questions directly against your uploaded lecture materials. The AI retrieves grounded information with exact page citations.
        </p>
      </div>

      {/* Query Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleQuery} className="space-y-4">
          <div>
            <label htmlFor="rag-question-input" className="block text-xs font-bold text-slate-800 mb-1.5">
              Ask Anything From Your Notes
            </label>
            <div className="relative">
              <input
                id="rag-question-input"
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What is deadlock, and what are its four necessary conditions?"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                aria-label="Submit question to PDF Tutor"
                className="absolute right-2 top-2 p-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-md shadow-brand-600/20 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Grounding Scope */}
            <div>
              <span className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Course Material Scope</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {selectedDocIds.length === 0 ? 'Searching All Notes' : `${selectedDocIds.length} Selected`}
                </span>
              </span>
              <div className="max-h-28 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                {documents.length > 0 ? (
                  documents.map((d) => (
                    <label key={d.id} htmlFor={`rag-doc-${d.id}`} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        id={`rag-doc-${d.id}`}
                        type="checkbox"
                        checked={selectedDocIds.includes(d.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocIds([...selectedDocIds, d.id]);
                          } else {
                            setSelectedDocIds(selectedDocIds.filter((id) => id !== d.id));
                          }
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span className="truncate">{d.title} ({d.subject})</span>
                    </label>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">No uploaded documents available.</p>
                )}
              </div>
            </div>

            {/* Learning Mode */}
            <div>
              <label htmlFor="rag-learning-mode" className="block text-xs font-bold text-slate-800 mb-1.5">Learning Mode</label>
              <select
                id="rag-learning-mode"
                value={learningMode}
                onChange={(e) => setLearningMode(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="exam_prep">🎯 Exam Preparation Mode (High-Yield & Scoring Focus)</option>
                <option value="detailed">📖 Detailed Academic Explanation (Formal In-Depth)</option>
                <option value="beginner">🐣 Beginner Friendly (Everyday Analogies)</option>
                <option value="quick_revision">⚡ Quick Revision Mode (Bullet Summaries)</option>
              </select>

              <div className="mt-3 p-2.5 rounded-xl bg-brand-50/70 border border-brand-100 flex items-center gap-2 text-[11px] text-brand-900">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" aria-hidden="true" />
                <span>Answers are verified and grounded with exact page citations to prevent hallucinations.</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">
            Vector searching across chunks and assembling page citations...
          </p>
        </div>
      )}

      {/* RAG Answer & Citations Layout */}
      {ragResponse && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Main Answer Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                Grounded Academic Response
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-100">
                {learningMode.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="prose-sm max-w-none text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
              {ragResponse.answer}
            </div>
          </div>

          {/* Citations Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Verified Page Citations</span>
              </h3>
              <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                {ragResponse.citations?.length || 0} Sources
              </span>
            </div>

            <div className="space-y-3">
              {ragResponse.citations && ragResponse.citations.length > 0 ? (
                ragResponse.citations.map((c) => (
                  <div
                    key={c.citation_id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDocPreview(c.document_id);
                      }
                    }}
                    onClick={() => openDocPreview(c.document_id)}
                    aria-label={`Open preview for document ${c.document_title}, page ${c.page_number}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 cursor-pointer transition-all space-y-2 group focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700 flex items-center gap-1">
                        <span>Page {c.page_number}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Match {Math.round((c.relevance_score || 0.8) * 100)}%
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {c.document_title}
                    </h4>

                    <p className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-3 leading-tight">
                      "{c.snippet}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  No direct citations referenced for this response.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Doc Preview Modal when citation clicked */}
      {previewDoc && (
        <DocViewerModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onBookmarkToggle={() => {}}
        />
      )}
    </div>
  );
}
