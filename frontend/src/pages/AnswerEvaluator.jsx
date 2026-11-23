import React, { useState } from 'react';
import { questionsAPI } from '../services/api';
import {
  FileCheck2,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Tag,
  Target
} from 'lucide-react';

export default function AnswerEvaluator() {
  const [question, setQuestion] = useState("What is deadlock in operating systems, and what are its four necessary conditions?");
  const [modelAnswer, setModelAnswer] = useState("Deadlock is a state where processes are blocked waiting for resources held by each other. The four conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.");
  const [studentAnswer, setStudentAnswer] = useState("Deadlock occurs when processes wait indefinitely for resources. The conditions are mutual exclusion where resources are non-shareable, hold and wait where a process holds resources while requesting more, no preemption where resources cannot be forcefully taken away, and circular wait where a closed loop of processes wait for each other.");
  const [maxMarks, setMaxMarks] = useState(10);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!question.trim() || !studentAnswer.trim() || evaluating) return;

    setEvaluating(true);
    setResult(null);
    try {
      const res = await questionsAPI.evaluateAnswer({
        question: question.trim(),
        model_answer: modelAnswer.trim() || null,
        student_answer: studentAnswer.trim(),
        max_marks: parseInt(maxMarks),
      });
      setResult(res.data);
    } catch (err) {
      console.error("Answer evaluation failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <FileCheck2 className="w-6 h-6 text-rose-600" />
          <span>AI Answer Evaluation System</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit your subjective exam answers to receive objective grading, keyword checks, depth analysis, and examiner feedback.
        </p>
      </div>

      {/* Form Input */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div>
            <label htmlFor="eval-question" className="block text-xs font-bold text-slate-800 mb-1">Examination Question</label>
            <textarea
              id="eval-question"
              rows={2}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Define Deadlock and explain the Banker's Algorithm."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="eval-model-answer" className="block text-xs font-bold text-slate-800 mb-1">
                Model Answer / Key Points (Optional)
              </label>
              <textarea
                id="eval-model-answer"
                rows={2}
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                placeholder="Optional expected answer or marking criteria guidelines..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="eval-max-marks" className="block text-xs font-bold text-slate-800 mb-1">Maximum Marks</label>
              <select
                id="eval-max-marks"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value={5}>5 Marks</option>
                <option value={10}>10 Marks</option>
                <option value={15}>15 Marks</option>
                <option value={20}>20 Marks</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="eval-student-answer" className="block text-xs font-bold text-slate-800 mb-1">Your Written Answer</label>
            <textarea
              id="eval-student-answer"
              rows={5}
              required
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Type your examination answer here as you would write on an exam paper..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={evaluating || !question.trim() || !studentAnswer.trim()}
              aria-label="Submit answer for AI academic evaluation"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <span>{evaluating ? 'Grading & Analyzing...' : 'Evaluate My Answer'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>

      {/* Evaluating Indicator */}
      {evaluating && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">
            Checking correctness, matching key academic concepts, and generating scoring breakdown...
          </p>
        </div>
      )}

      {/* Evaluation Rubric Results */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 space-y-6 animate-in fade-in duration-300">
          {/* Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex flex-col items-center justify-center font-bold">
                <span className="text-xl leading-none">{result.score}</span>
                <span className="text-[10px] text-slate-400">/ {result.max_marks}</span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[10px] uppercase">
                  Verdict: {result.verdict}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Overall Performance: {result.percentage}%
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Evaluated with AI Marking Scheme</span>
            </div>
          </div>

          {/* Feedback Body */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Examiner Feedback</span>
            </h4>
            <p>{result.feedback}</p>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Keywords Successfully Identified</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords_found?.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-emerald-200 text-emerald-800 font-semibold text-[11px] rounded-lg">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Recommended Keywords to Add</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords_missing?.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-amber-200 text-amber-800 font-semibold text-[11px] rounded-lg">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Improvement Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>Key Answer Strengths</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>How to Gain Maximum Marks</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {result.areas_for_improvement?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            ⚠️ AI evaluations are automated study benchmarks based on semantic rubrics and do not constitute formal university marks.
          </div>
        </div>
      )}
    </div>
  );
}
