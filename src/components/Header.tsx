import React from 'react';
import { Copy, Check, ShieldCheck, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'plain_text' | 'configure' | 'store_guidance' | 'ai_audit' | 'web_preview';
  setActiveTab: (tab: 'plain_text' | 'configure' | 'store_guidance' | 'ai_audit' | 'web_preview') => void;
  onCopyPlainText: () => void;
  hasCopied: boolean;
  appName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onCopyPlainText,
  hasCopied,
  appName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            AppPolicy Spec
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('plain_text')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'plain_text'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Plain-Text Policy
          </button>
          <button
            onClick={() => setActiveTab('configure')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'configure'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            App Config
          </button>
          <button
            onClick={() => setActiveTab('store_guidance')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'store_guidance'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Play & App Store Guides
          </button>
          <button
            onClick={() => setActiveTab('ai_audit')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'ai_audit'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Policy Auditor
          </button>
          <button
            onClick={() => setActiveTab('web_preview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'web_preview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Public View
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onCopyPlainText}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-indigo-600/30 whitespace-nowrap shrink-0"
            title="Copy complete plain-text policy for Google Play Console or Apple App Store"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Plain Text</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
