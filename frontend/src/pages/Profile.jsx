import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Lock,
  CheckCircle,
  AlertCircle,
  Save,
  ShieldCheck,
  Trash2,
  Download,
  AlertTriangle,
  X
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    education_level: user?.education_level || 'Undergraduate',
    course: user?.course || 'Computer Science',
    semester: user?.semester || 'Semester 1',
    target_exam: user?.target_exam || 'University Semester Exams',
    bio: user?.bio || '',
    password: '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Erasure modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      await updateProfile(payload);
      setSuccess("Profile settings saved successfully!");
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError("Failed to update profile. Please verify your connection.");
    } finally {
      setSaving(false);
    }
  };

  // DPDP Section 11 - Right to Access & Data Portability
  const handleExportData = () => {
    const exportPayload = {
      export_date: new Date().toISOString(),
      regulation_compliance: "India DPDP Act 2023 (Section 11) & GDPR (Article 20)",
      platform: "Exam Buddy AI",
      user_profile: {
        id: user?.id,
        full_name: user?.full_name,
        email: user?.email,
        education_level: user?.education_level,
        course: user?.course,
        semester: user?.semester,
        target_exam: user?.target_exam,
        bio: user?.bio,
        created_at: user?.created_at,
      },
      retention_notice: "You have the right to request full erasure at any time from this dashboard."
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_buddy_data_export_${user?.id || 'profile'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // DPDP Section 12 - Right to Erasure
  const handleDeleteAccount = async () => {
    if (deleteConfirmation.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type "DELETE" into the box to confirm permanent erasure.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    try {
      await authAPI.deleteAccount();
      logout();
      navigate('/register', { replace: true });
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Failed to erase account. Please contact privacy@exambuddy.edu.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <User className="w-6 h-6 text-brand-600" aria-hidden="true" />
          <span>Student Profile & Examination Settings</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Customize your academic profile, target exams, and exercise your privacy rights under India's DPDP Act 2023.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {success && (
          <div role="status" className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-full-name" className="block text-xs font-bold text-slate-800 mb-1.5">
                Full Legal / Student Name
              </label>
              <input
                id="profile-full-name"
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-xs font-bold text-slate-800 mb-1.5">
                Registered Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                disabled
                aria-describedby="email-immutable-note"
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-600 cursor-not-allowed font-medium"
              />
              <span id="email-immutable-note" className="text-[11px] text-slate-500 mt-1 block">
                Email cannot be modified directly. Contact support for identity updates.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-education-level" className="block text-xs font-bold text-slate-800 mb-1.5">
                Education Level
              </label>
              <select
                id="profile-education-level"
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="High School">High School (11th / 12th Standard)</option>
                <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / B.Com / MBBS / BA)</option>
                <option value="Graduate">Graduate / Master's (M.Tech / M.Sc / MBA / MA)</option>
                <option value="Competitive Exam">Competitive Exam Aspirant (GATE, GRE, UPSC, NEET, JEE)</option>
              </select>
            </div>

            <div>
              <label htmlFor="profile-semester" className="block text-xs font-bold text-slate-800 mb-1.5">
                Semester / Current Academic Year
              </label>
              <input
                id="profile-semester"
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="e.g. Semester 5 or Final Year"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-course" className="block text-xs font-bold text-slate-800 mb-1.5">
                Academic Course / Major
              </label>
              <input
                id="profile-course"
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="profile-target-exam" className="block text-xs font-bold text-slate-800 mb-1.5">
                Target Upcoming Examination
              </label>
              <input
                id="profile-target-exam"
                type="text"
                name="target_exam"
                value={formData.target_exam}
                onChange={handleChange}
                placeholder="e.g. University Finals (Dec 2026) & GATE 2027"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-bio" className="block text-xs font-bold text-slate-800 mb-1.5">
              Academic Bio & Learning Goals (Optional)
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your AI study companion about your revision targets and areas you need help with..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              aria-label="Save Profile Settings"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Privacy, Data Rights & DPDP Act 2023 Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <span>Your Data Privacy Rights (India DPDP Act 2023 & GDPR)</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under India's Digital Personal Data Protection (DPDP) Act 2023 (Sections 11 & 12) and international privacy laws,
              you retain sovereign ownership over your personal and academic data.
            </p>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex-shrink-0">
            DPDP Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Data Portability */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-brand-600" aria-hidden="true" />
                <span>Right to Access & Portability (Sec. 11)</span>
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Download a machine-readable JSON copy of your profile, academic settings, and timestamps stored in our database.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              aria-label="Export my personal data as JSON"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors w-full focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
              <span>Export Personal Data (.json)</span>
            </button>
          </div>

          {/* Right to Erasure */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" aria-hidden="true" />
                <span>Right to Erasure / Account Deletion (Sec. 12)</span>
              </h3>
              <p className="text-[11px] text-rose-700 leading-relaxed mt-1">
                Permanently purge your account, uploaded study PDFs, generated notes, and AI chat history. This action is irreversible.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmation('');
                setDeleteError('');
                setShowDeleteModal(true);
              }}
              aria-label="Request permanent account and data erasure"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors w-full shadow-sm shadow-rose-600/20 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Delete Account & Erase All Data</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <span>Need help or have a grievance? Contact our Grievance Redressal Officer at <a href="mailto:grievance@exambuddy.edu" className="text-brand-600 underline hover:text-brand-700">grievance@exambuddy.edu</a>.</span>
          <Link to="/privacy-policy" className="text-brand-600 hover:underline font-medium">Read Full Privacy Policy &rarr;</Link>
        </div>
      </div>

      {/* Confirmation Modal for Account Deletion */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Close delete confirmation modal"
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div>
              <h2 id="delete-modal-title" className="text-base font-bold text-slate-900">
                Permanent Account & Data Erasure
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                In compliance with Section 12 of India's DPDP Act 2023, confirming this request will immediately and irreversibly delete:
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside mt-2 space-y-1">
                <li>Your student authentication record and profile</li>
                <li>All uploaded PDF, DOCX, and text notes on server disks</li>
                <li>All vector embeddings and vector database indexes</li>
                <li>All past chat history, flashcards, and study plans</li>
              </ul>
            </div>

            {deleteError && (
              <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {deleteError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="confirm-delete-input" className="block text-xs font-bold text-slate-800">
                Type <span className="font-mono text-rose-600 font-extrabold">DELETE</span> to confirm:
              </label>
              <input
                id="confirm-delete-input"
                type="text"
                autoComplete="off"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || deleteConfirmation.trim().toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccount}
                aria-label="Confirm permanent account deletion"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isDeleting ? 'Erasing Data...' : 'Confirm Permanent Erasure'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}