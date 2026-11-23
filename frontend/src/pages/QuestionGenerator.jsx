import React, { useState, useEffect } from 'react';
import { questionsAPI, documentsAPI } from '../services/api';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';

export default function QuestionGenerator() {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('mcq');
  const [numQuestions, setNumQuestions] = useState(3);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');

  const [generating, setGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizScoreResult, setQuizScoreResult] = useState(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const res = await documentsAPI.list();
      setAvailableDocs(res.data);
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim() || generating) return;

    setGenerating(true);
    setActiveQuiz(null);
    setStudentAnswers({});
    setQuizScoreResult(null);

    try {
      const payload = {
        topic: topic.trim(),
        subject: subject.trim() || 'General',
        difficulty,
        question_type: questionType,
        number_of_questions: parseInt(numQuestions),
        document_id: selectedDocId ? parseInt(selectedDocId) : null,
      };

      const res = await questionsAPI.generate(payload);
      setActiveQuiz(res.data);
    } catch (err) {
      console.error("Quiz generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectOption = (questionId, optionPrefix) => {
    setStudentAnswers({
      ...studentAnswers,
      [questionId.toString()]: optionPrefix,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const res = await questionsAPI.submitQuiz({
        quiz_id: activeQuiz.id,
        answers: studentAnswers,
      });
      setQuizScoreResult(res.data);
    } catch (err) {
      console.error("Failed to submit quiz attempt:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setStudentAnswers({});
    setQuizScoreResult(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
          <span>AI Examination Question Generator</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Create customized examination question sets, interactive MCQs, and full mock examination papers with automated scoring.
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="quiz-topic" className="block text-xs font-bold text-slate-800 mb-1.5">Exam Topic</label>
              <input
                id="quiz-topic"
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Banker's Algorithm, Binary Search Trees, Carnot Cycle"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="quiz-subject" className="block text-xs font-bold text-slate-800 mb-1.5">Subject</label>
              <input
                id="quiz-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
            {/* Question Type */}
            <div>
              <label htmlFor="quiz-type" className="block text-xs font-bold text-slate-800 mb-1.5">Question Type</label>
              <select
                id="quiz-type"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="short_answer">Short-Answer Questions</option>
                <option value="long_answer">Long-Answer Problem Sets</option>
                <option value="mock_paper">Full Mock Exam Paper</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="quiz-difficulty" className="block text-xs font-bold text-slate-800 mb-1.5">Difficulty Level</label>
              <select
                id="quiz-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Easy">🟢 Easy (Foundational)</option>
                <option value="Medium">🟡 Medium (University Standard)</option>
                <option value="Hard">🔴 Hard (Competitive / GATE Level)</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label htmlFor="quiz-num" className="block text-xs font-bold text-slate-800 mb-1.5">Question Count</label>
              <select
                id="quiz-num"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={3}>3 Questions (Quick Drill)</option>
                <option value={5}>5 Questions (Standard Practice)</option>
                <option value={10}>10 Questions (Intensive Quiz)</option>
              </select>
            </div>

            {/* Grounding Notes Document */}
            <div>
              <label htmlFor="quiz-doc" className="block text-xs font-bold text-slate-800 mb-1.5">Ground in Note</label>
              <select
                id="quiz-doc"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">None (General Topic)</option>
                {availableDocs.map((d) => (
                  <option key={d.id} value={d.id}>📄 {d.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={generating || !topic.trim()}
              aria-label="Generate AI examination questions"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span>{generating ? 'Formulating Exam Questions...' : 'Generate Questions'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Generating Indicator */}
      {generating && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">
            Designing academic questions with distractors, solutions, and marking rubric...
          </p>
        </div>
      )}

      {/* Interactive Quiz Canvas */}
      {activeQuiz && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                {activeQuiz.subject} • {activeQuiz.difficulty} • {activeQuiz.question_type.toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeQuiz.title}</h2>
            </div>

            {quizScoreResult && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
                <Award className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    Score: {quizScoreResult.score} / {quizScoreResult.total_points} ({quizScoreResult.percentage}%)
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">Auto-Graded Test Attempt</p>
                </div>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => {
              const qIdStr = q.id.toString();
              const selectedOption = studentAnswers[qIdStr];
              const scoreDetail = quizScoreResult?.results?.find((r) => r.question_id === q.id);

              return (
                <div key={q.id} className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      <span className="text-emerald-700 mr-2">Q{idx + 1}.</span>
                      {q.question}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 shrink-0">1 Mark</span>
                  </div>

                  {/* MCQ Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1" role="radiogroup" aria-label={`Question ${idx + 1} options`}>
                      {q.options.map((opt, optIdx) => {
                        const optPrefix = opt.substring(0, 1).toUpperCase();
                        const isChosen = selectedOption === optPrefix;

                        return (
                          <div
                            key={optIdx}
                            role="radio"
                            aria-checked={isChosen}
                            tabIndex={quizScoreResult ? -1 : 0}
                            onKeyDown={(e) => {
                              if (!quizScoreResult && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                handleSelectOption(q.id, optPrefix);
                              }
                            }}
                            onClick={() => !quizScoreResult && handleSelectOption(q.id, optPrefix)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              isChosen
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-sm'
                                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                            } ${quizScoreResult ? 'cursor-default' : ''}`}
                          >
                            <span>{opt}</span>
                            {isChosen && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Post-submission feedback & explanation */}
                  {scoreDetail && (
                    <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
                      scoreDetail.is_correct ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
                    }`}>
                      <div className="flex items-center gap-2 font-bold">
                        {scoreDetail.is_correct ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                            <span>Correct! (Selected {scoreDetail.student_answer})</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" aria-hidden="true" />
                            <span>Incorrect. Correct Answer: {scoreDetail.correct_answer}</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed pt-1 opacity-90">
                        <strong>Explanation:</strong> {scoreDetail.explanation || q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Exam questions are AI-generated practice materials for revision purposes.
            </span>
            <div className="flex items-center gap-3">
              {quizScoreResult ? (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  aria-label="Retake this examination quiz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Retake Quiz</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={submitting || Object.keys(studentAnswers).length === 0}
                  aria-label="Submit quiz answers for auto-grading"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span>{submitting ? 'Submitting & Evaluating...' : 'Submit Answers for Grading'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
