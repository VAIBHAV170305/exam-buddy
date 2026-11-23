import React, { useState, useEffect } from 'react';
import { documentsAPI } from '../services/api';
import DocViewerModal from '../components/DocViewerModal';
import {
  UploadCloud,
  FolderOpen,
  Search,
  Bookmark,
  Trash2,
  Eye,
  Download,
  Filter,
  FileText,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function NotesManager() {
  const [documents, setDocuments] = useState([]);
  const [taxonomy, setTaxonomy] = useState({ subjects: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadFolder, setUploadFolder] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedSubject) params.subject = selectedSubject;
      if (selectedFolder) params.category_folder = selectedFolder;
      if (onlyBookmarked) params.is_bookmarked = true;
      if (search) params.search = search;

      const [docsRes, taxRes] = await Promise.all([
        documentsAPI.list(params),
        documentsAPI.getTaxonomy(),
      ]);
      setDocuments(docsRes.data);
      setTaxonomy(taxRes.data);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedSubject, selectedFolder, onlyBookmarked]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocs();
  };

  const handleBookmarkToggle = async (docId, currentBookmarkStatus) => {
    try {
      await documentsAPI.update(docId, { is_bookmarked: currentBookmarkStatus });
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, is_bookmarked: currentBookmarkStatus } : d))
      );
      if (activeDoc && activeDoc.id === docId) {
        setActiveDoc({ ...activeDoc, is_bookmarked: currentBookmarkStatus });
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this study note?")) return;
    try {
      await documentsAPI.delete(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (activeDoc && activeDoc.id === docId) {
        setActiveDoc(null);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const [copyrightConsent, setCopyrightConsent] = useState(false);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!copyrightConsent) {
      setUploadError("You must confirm copyright ownership or authorization before uploading.");
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      if (uploadTitle) formData.append('title', uploadTitle);
      if (uploadSubject) formData.append('subject', uploadSubject);
      if (uploadFolder) formData.append('category_folder', uploadFolder);

      await documentsAPI.upload(formData);
      setUploadSuccess("Notes uploaded and vectorized successfully!");
      setFileToUpload(null);
      setUploadTitle('');
      setUploadSubject('');
      setUploadFolder('');
      setCopyrightConsent(false);
      setTimeout(() => {
        setUploadOpen(false);
        setUploadSuccess('');
      }, 1200);
      fetchDocs();
    } catch (err) {
      setUploadError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FolderOpen className="w-6 h-6 text-brand-600" />
            <span>Smart Notes Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, organize, preview, and vectorize lecture notes, PDFs, DOCX, and past exam resources.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Study Notes</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Subjects</option>
            {taxonomy.subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Folder Filter */}
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Folders</option>
            {taxonomy.folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Bookmark Toggle */}
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              onlyBookmarked
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Bookmarked</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Loading your notes collection...</p>
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 font-extrabold text-[11px] uppercase flex items-center justify-center">
                      {doc.file_type}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{doc.subject}</span>
                      <p className="text-[11px] text-slate-400">{doc.category_folder} • {doc.page_count} Pages</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookmarkToggle(doc.id, !doc.is_bookmarked)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      doc.is_bookmarked
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-slate-300 hover:text-amber-500'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${doc.is_bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                {doc.summary ? (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {doc.summary}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No AI summary generated yet.</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveDoc(doc)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Text</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={documentsAPI.downloadUrl(doc.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Download Note"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Study Materials Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your lecture slides, notes, or textbooks to ask questions and generate exam summaries.
          </p>
          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload First Note</span>
          </button>
        </div>
      )}

      {/* Document Preview Modal */}
      {activeDoc && (
        <DocViewerModal
          doc={activeDoc}
          onClose={() => setActiveDoc(null)}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}

      {/* Upload Modal Dialog */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Upload Study Notes</h3>
                <p className="text-xs text-slate-500">Supports PDF, DOCX, and TXT files</p>
              </div>
              <button
                onClick={() => setUploadOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* File input */}
              <div>
                <label htmlFor="doc-upload-file" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select File <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" aria-hidden="true" />
                  <input
                    id="doc-upload-file"
                    type="file"
                    required
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileToUpload(e.target.files[0]);
                        if (!uploadTitle) {
                          setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  {fileToUpload && (
                    <p className="mt-2 text-xs font-semibold text-brand-600">
                      Selected: {fileToUpload.name} ({(fileToUpload.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="doc-upload-title" className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  id="doc-upload-title"
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Chapter 7 Deadlocks"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="doc-upload-subject" className="block text-xs font-bold text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="doc-upload-subject"
                    type="text"
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="doc-upload-folder" className="block text-xs font-bold text-slate-700 mb-1">
                    Category Folder
                  </label>
                  <input
                    id="doc-upload-folder"
                    type="text"
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    placeholder="e.g. Lecture Notes"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Copyright & Fair Use Confirmation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-start gap-2">
                  <input
                    id="doc-copyright-consent"
                    type="checkbox"
                    required
                    checked={copyrightConsent}
                    onChange={(e) => setCopyrightConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="doc-copyright-consent" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                    <strong>Copyright Declaration:</strong> I certify that I have the lawful right or institutional permission to upload this study material and it does not violate third-party intellectual property rights. <span className="text-rose-500">*</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  aria-label="Cancel note upload"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !copyrightConsent}
                  aria-label="Submit and vectorize note"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 shadow-md shadow-brand-600/20 focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {uploading ? 'Processing & Vectorizing...' : 'Upload Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
