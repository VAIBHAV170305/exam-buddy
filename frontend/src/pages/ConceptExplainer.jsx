import React, { useState } from 'react';
import { explainerAPI } from '../services/api';
import {
  Lightbulb,
  Languages,
  Layers,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

export default function ConceptExplainer() {
  const [concept, setConcept] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('beginner');
  const [language, setLanguage] = useState('english');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concept.trim() || loading) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await explainerAPI.explain({
        concept: concept.trim(),
        subject: subject.trim() || 'General',
        level,
        language,
        include_examples: includeExamples,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Concept explanation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (!result?.explanation) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result.explanation.replace(/[*#_`]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopy = () => {
    if (result?.explanation) {
      navigator.clipboard.writeText(result.explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <span>AI Concept Explainer</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Master challenging concepts through everyday analogies, beginner-to-advanced levels, and bilingual English & Hindi support.
        </p>
      </div>

      {/* Query Configuration Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="explainer-concept" className="block text-xs font-bold text-slate-800 mb-1.5">
                Academic Concept / Topic
              </label>
              <input
                id="explainer-concept"
                type="text"
                required
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. Deadlock Coffman Conditions, Eigenvalues, TCP 3-Way Handshake"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="explainer-subject" className="block text-xs font-bold text-slate-800 mb-1.5">
                Subject (Optional)
              </label>
              <input
                id="explainer-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Level Selector */}
            <div>
              <label htmlFor="explainer-level" className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span>Proficiency Level</span>
              </label>
              <select
                id="explainer-level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="beginner">🐣 Beginner (High-school / Non-expert)</option>
                <option value="intermediate">📘 Intermediate (Undergraduate)</option>
                <option value="advanced">🔬 Advanced (Graduate & Rigorous)</option>
              </select>
            </div>

            {/* Language Selector */}
            <div>
              <label htmlFor="explainer-language" className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span>Language Mode</span>
              </label>
              <select
                id="explainer-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="english">🇬🇧 English</option>
                <option value="hindi">🇮🇳 Bilingual Hindi + English (Hinglish)</option>
              </select>
            </div>

            {/* Real World Examples Checkbox */}
            <div className="flex items-center sm:pt-6">
              <label htmlFor="explainer-examples" className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  id="explainer-examples"
                  type="checkbox"
                  checked={includeExamples}
                  onChange={(e) => setIncludeExamples(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span>Include Real-World Analogies</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !concept.trim()}
              aria-label="Explain concept with AI"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <span>{loading ? 'Synthesizing Explanation...' : 'Explain Concept'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">
            Structuring analogies, core definitions, and exam takeaways...
          </p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border-b border-amber-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                {result.subject} • {result.level.toUpperCase()} • {result.language.toUpperCase()}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">{result.concept}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSpeech}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isSpeaking
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-amber-600'
                }`}
                title={isSpeaking ? 'Stop Audio' : 'Read Aloud (Voice Assistant)'}
                aria-label={isSpeaking ? 'Stop audio read aloud' : 'Read concept explanation aloud using voice synthesizer'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" aria-hidden="true" /> : <Volume2 className="w-4 h-4" aria-hidden="true" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop Reading' : 'Listen'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-600 text-xs font-semibold flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                title="Copy Explanation"
                aria-label="Copy concept explanation to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="p-8 prose-sm max-w-none text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
            {result.explanation}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            AI explanations simplify complex topics using analogies. Always consult your syllabus textbook for definitive proofs.
          </div>
        </div>
      )}
    </div>
  );
}
