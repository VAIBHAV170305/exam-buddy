import React, { useState, useEffect, useRef } from 'react';
import { assistantAPI, documentsAPI } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Check,
  Copy,
  PlusCircle,
  Clock,
  Trash2,
  HelpCircle,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';

const LEARNING_MODES = [
  { id: 'beginner', label: '🐣 Beginner Mode', desc: 'Simple analogies & zero jargon' },
  { id: 'detailed', label: '📖 Detailed Mode', desc: 'Rigorous step-by-step mechanisms' },
  { id: 'exam_prep', label: '🎯 Exam Prep Mode', desc: 'High-yield points & scoring criteria' },
  { id: 'quick_revision', label: '⚡ Quick Revision', desc: 'Dense bullets & memory mnemonics' },
];

export default function AiAssistant() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [learningMode, setLearningMode] = useState('detailed');
  const [availableDocs, setAvailableDocs] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
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

  const loadConversations = async () => {
    try {
      const res = await assistantAPI.listConversations();
      setConversations(res.data);
      if (res.data.length > 0 && !activeConvId) {
        selectConversation(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const selectConversation = async (convId) => {
    setActiveConvId(convId);
    try {
      const res = await assistantAPI.getConversation(convId);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load conversation details:", err);
    }
  };

  const startNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setInputQuestion('');
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await assistantAPI.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) {
        startNewChat();
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim() || sending) return;

    const userText = inputQuestion.trim();
    setInputQuestion('');

    // Append optimistic user message
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userText,
      learning_mode: learningMode,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const res = await assistantAPI.chat({
        conversation_id: activeConvId,
        question: userText,
        learning_mode: learningMode,
        document_ids: selectedDocIds.length > 0 ? selectedDocIds : null,
      });

      const { conversation_id, message } = res.data;
      if (!activeConvId) {
        setActiveConvId(conversation_id);
        loadConversations();
      }
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '⚠️ I encountered an error while processing your academic query. Please try asking again.',
          learning_mode: learningMode,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Left Chat Sessions Drawer */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-sm text-slate-900">Academic Sessions</span>
          </div>
          <button
            onClick={startNewChat}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            title="Start New Academic Chat"
            aria-label="Start New Academic Chat Session"
          >
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length > 0 ? (
            conversations.map((c) => (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectConversation(c.id);
                  }
                }}
                onClick={() => selectConversation(c.id)}
                aria-label={`Open session: ${c.title || 'Untitled Session'}`}
                className={`p-3 rounded-xl text-xs cursor-pointer flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  activeConvId === c.id
                    ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="truncate flex-1 pr-2">
                  <p className="truncate">{c.title || 'Untitled Session'}</p>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  aria-label={`Delete session ${c.title || 'Untitled'}`}
                  className="opacity-70 hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity focus:outline-none focus:ring-1 focus:ring-rose-500 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-xs text-slate-500">No past conversations.</p>
          )}
        </div>

        {/* Selected Notes Attachment Filter */}
        {availableDocs.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/70">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Ground In Course Notes
            </span>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {availableDocs.map((d) => (
                <label key={d.id} htmlFor={`doc-filter-${d.id}`} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    id={`doc-filter-${d.id}`}
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
                  <span className="truncate">{d.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Conversation Canvas */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Top Control Bar: AI Learning Modes */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Mode:</span>
            <div className="flex flex-wrap gap-1.5">
              {LEARNING_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setLearningMode(mode.id)}
                  title={mode.desc}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    learningMode === mode.id
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden md:block">
            {LEARNING_MODES.find((m) => m.id === learningMode)?.desc}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">What would you like to master today?</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask any complex academic question, request step-by-step mathematical proofs, or inquire directly about your uploaded course notes.
              </p>

              {/* Sample Prompt Pills */}
              <div className="w-full space-y-2 pt-2 text-left">
                <button
                  onClick={() => setInputQuestion("Explain Banker's Algorithm and how it avoids deadlocks.")}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 hover:border-brand-400 hover:text-brand-600 transition-colors shadow-sm"
                >
                  💡 Explain Banker's Algorithm and how it avoids deadlocks
                </button>
                <button
                  onClick={() => setInputQuestion("What is the time complexity difference between QuickSort and MergeSort?")}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 hover:border-brand-400 hover:text-brand-600 transition-colors shadow-sm"
                >
                  💡 What is the time complexity difference between QuickSort and MergeSort?
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-brand-600/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm relative group ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.learning_mode && msg.role !== 'user' && (
                    <div className="mb-2 inline-block px-2 py-0.5 rounded-full bg-brand-50 border border-brand-100 text-[10px] font-bold text-brand-700 uppercase">
                      {msg.learning_mode}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans prose-sm max-w-none">
                    {msg.content}
                  </div>

                  {msg.role !== 'user' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute top-3 right-3 opacity-80 hover:opacity-100 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                      title="Copy response"
                      aria-label="Copy AI response to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                <span>Exam Buddy is synthesizing your explanation...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Question Input Box */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
            <label htmlFor="academic-question-input" className="sr-only">
              Ask an academic question
            </label>
            <input
              id="academic-question-input"
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Ask an academic question in ${LEARNING_MODES.find((m) => m.id === learningMode)?.label}...`}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || sending}
              aria-label="Send academic question"
              className="absolute right-2 p-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-md shadow-brand-600/20 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" aria-hidden="true" />
            <span>AI study responses may contain inaccuracies. Please cross-verify critical proofs & formulas.</span>
          </p>
        </div>
      </main>
    </div>
  );
}
