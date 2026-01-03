import React, { useState } from 'react';
import { INJECT_URL } from './types';

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INJECT_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[320px] p-4 bg-white border border-gray-200">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">⚡</span> Script Injector
        </h1>
        <p className="text-xs text-gray-500 font-medium">Local Development Tool</p>
      </header>

      <div className="space-y-4">
        {/* Status Section */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h2 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Target URL</h2>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-2 py-1 rounded border border-blue-200 text-xs text-gray-600 truncate font-mono">
              {INJECT_URL}
            </code>
            <button 
              onClick={handleCopy}
              className="p-1 hover:bg-blue-200 rounded text-blue-600 transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Shortcuts */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Hot Reload Shortcut</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-100">
              <span className="text-gray-500 text-[10px] mb-1">MacOS</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-bold text-gray-700 shadow-sm">Cmd + I</kbd>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-100">
              <span className="text-gray-500 text-[10px] mb-1">Windows</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-bold text-gray-700 shadow-sm">Ctrl + I</kbd>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-bold text-gray-700">Note:</span> Ensure your local server is running on port <span className="font-mono text-gray-700">8282</span>. The extension handles CORS automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
