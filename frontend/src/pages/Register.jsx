import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, User, Mail, Lock, BookOpen, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    education_level: 'Undergraduate',
    course: 'B.Tech Computer Science',
    semester: 'Semester 4',
    target_exam: 'University Final Examination',
  });
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentAgreed) {
      setError('You must review and agree to the Terms & Conditions and Privacy Policy to create an account.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual background ambient shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-xl shadow-brand-500/30 mb-3">
          <GraduationCap className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Student Account</h1>
        <p className="mt-1 text-sm text-slate-300">
          Personalize Exam Buddy for your curriculum and upcoming examinations
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10 space-y-6">
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-200 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-200 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-200 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="reg-password"
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong, secure password"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Academic Level & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-education" className="block text-xs font-semibold text-slate-200 mb-1">
                  Education Level
                </label>
                <select
                  id="reg-education"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="High School">High School (11th / 12th)</option>
                  <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / B.Com / MBBS)</option>
                  <option value="Graduate">Graduate / Master's (M.Tech / M.Sc / MBA)</option>
                  <option value="Competitive Exam">Competitive Exam Aspirant (GATE, GRE, UPSC)</option>
                </select>
              </div>

              <div>
                <label htmlFor="reg-semester" className="block text-xs font-semibold text-slate-200 mb-1">
                  Semester / Year
                </label>
                <input
                  id="reg-semester"
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g. Semester 5"
                  className="block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Course & Target Exam */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-course" className="block text-xs font-semibold text-slate-200 mb-1">
                  Course / Major
                </label>
                <input
                  id="reg-course"
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science & Eng"
                  className="block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label htmlFor="reg-target-exam" className="block text-xs font-semibold text-slate-200 mb-1">
                  Target Examination
                </label>
                <input
                  id="reg-target-exam"
                  type="text"
                  name="target_exam"
                  value={formData.target_exam}
                  onChange={handleChange}
                  placeholder="e.g. University Finals, GATE"
                  className="block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Statutory DPDP & Terms Consent Checkboxes */}
            <div className="pt-2 space-y-3 border-t border-slate-700/80">
              <div className="flex items-start gap-2.5">
                <input
                  id="reg-consent"
                  type="checkbox"
                  required
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-brand-600 bg-slate-900 border-slate-700 focus:ring-brand-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <label htmlFor="reg-consent" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-brand-400 hover:text-brand-300 underline font-semibold">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-brand-400 hover:text-brand-300 underline font-semibold">
                    Privacy Policy
                  </Link>
                  , and give consent for processing my academic data strictly under the <strong>Digital Personal Data Protection Act, 2023</strong>. <span className="text-rose-400">*</span>
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  id="reg-parental"
                  type="checkbox"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-brand-600 bg-slate-900 border-slate-700 focus:ring-brand-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <label htmlFor="reg-parental" className="text-[11px] text-slate-400 leading-relaxed cursor-pointer select-none">
                  (Optional Declaration): If under 18 years of age, I confirm I have obtained the consent of my parent or lawful guardian as required under Section 9 of the DPDP Act 2023.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !consentAgreed}
              aria-label="Complete Student Registration"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all mt-4 focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none"
            >
              <span>{submitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold underline">
              Sign into account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
