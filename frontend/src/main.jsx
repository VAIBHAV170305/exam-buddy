import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { ErrorBoundary } from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("Critical Exam Buddy Mount Error:", err);
    rootElement.innerHTML = `
      <div style="font-family: system-ui, -apple-system, sans-serif; display:flex; min-height:100vh; align-items:center; justify-content:center; background:#f8fafc; padding:24px;">
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:24px; padding:32px; max-width:440px; text-align:center; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
          <div style="font-size:36px; margin-bottom:12px;">🎓</div>
          <h2 style="font-size:18px; font-weight:bold; color:#0f172a; margin-bottom:8px;">Exam Buddy Academic AI</h2>
          <p style="font-size:13px; color:#64748b; margin-bottom:20px; line-height:1.5;">${err?.message || 'Recovering learning workspace...'}</p>
          <button onclick="window.location.reload()" style="background:#0284c7; color:#fff; border:none; padding:10px 22px; border-radius:12px; font-weight:bold; cursor:pointer; font-size:13px;">Reload Application</button>
        </div>
      </div>
    `;
  }
}
