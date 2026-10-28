import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Code, ExternalLink, ArrowUpRight } from 'lucide-react';
import { PolicyConfig } from '../types/policy';
import { generatePlainTextPolicy, generateMarkdownPolicy, generateStandaloneHtml } from '../utils/policyGenerator';

interface PlainTextPolicyViewProps {
  config: PolicyConfig;
  onCopyPlainText: () => void;
  hasCopied: boolean;
  onNavigateToConfig: () => void;
  onNavigateToGuidance: () => void;
}

export const PlainTextPolicyView: React.FC<PlainTextPolicyViewProps> = ({
  config,
  onCopyPlainText,
  hasCopied,
  onNavigateToConfig,
  onNavigateToGuidance,
}) => {
  const plainText = generatePlainTextPolicy(config);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    const filename = `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_privacy_policy.txt`;
    downloadFile(filename, plainText, 'text/plain;charset=utf-8');
  };

  const handleDownloadMd = () => {
    const filename = `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_privacy_policy.md`;
    downloadFile(filename, generateMarkdownPolicy(config), 'text/markdown;charset=utf-8');
  };

  const handleDownloadHtml = () => {
    const filename = `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_privacy_policy.html`;
    downloadFile(filename, generateStandaloneHtml(config), 'text/html;charset=utf-8');
  };

  const jumpToSection = (sectionNumber: number) => {
    const container = document.getElementById('policy-text-display');
    if (!container) return;
    const targetText = `${sectionNumber}. `;
    const fullText = container.innerText;
    const index = fullText.indexOf(targetText);
    if (index !== -1) {
      const approximatePercent = index / fullText.length;
      container.scrollTop = container.scrollHeight * approximatePercent;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{config.companyName}</span>
              <span aria-hidden="true">·</span>
              <span>{config.country}</span>
              <span aria-hidden="true">·</span>
              <span>{config.appType}</span>
              <span aria-hidden="true">·</span>
              <span>Effective {config.effectiveDate}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Privacy Policy for {config.appName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ready for direct copy-paste into Google Play Console and Apple App Store Connect.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-lg shrink-0">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-sans">Sections</span>
              <span className="font-semibold text-slate-200 tabular-nums">8 / 8 Standard</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-sans">Words</span>
              <span className="font-semibold text-slate-200 tabular-nums">{wordCount.toLocaleString()}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-sans">Characters</span>
              <span className="font-semibold text-slate-200 tabular-nums">{charCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full text-xs">
            <span className="text-slate-500 whitespace-nowrap mr-1 font-medium">Jump to:</span>
            {[
              { num: 1, label: '1. Scope' },
              { num: 2, label: '2. Collection' },
              { num: 3, label: '3. Permissions' },
              { num: 4, label: '4. Third-Party' },
              { num: 5, label: '5. Retention' },
              { num: 6, label: '6. Children' },
              { num: 7, label: '7. Changes' },
              { num: 8, label: '8. Contact' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => jumpToSection(s.num)}
                className="px-2.5 py-1 rounded bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors whitespace-nowrap text-xs font-mono"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Export / Download Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
              title="Download as clean UTF-8 text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.TXT</span>
            </button>
            <button
              onClick={handleDownloadMd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
              title="Download as Markdown file"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>.MD</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 hover:bg-indigo-900/60 rounded-md transition-colors whitespace-nowrap"
              title="Download standalone HTML file ready for GitHub Pages or your website"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Standalone HTML</span>
            </button>
            <button
              onClick={onCopyPlainText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors whitespace-nowrap"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Plain Text Display Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-300 font-medium">privacy_policy.txt</span>
            <span aria-hidden="true">·</span>
            <span>UTF-8 Plain Text</span>
            <span aria-hidden="true">·</span>
            <span>Standard Play Store & App Store Format</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToConfig}
              className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <span>Edit Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <button
              onClick={onNavigateToGuidance}
              className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <span>View Data Safety</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div
          id="policy-text-display"
          className="p-5 sm:p-8 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text max-h-[700px] overflow-y-auto bg-slate-950 font-normal"
        >
          {plainText}
        </div>
      </div>

      {/* Compliance Callout Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span className="text-slate-200 font-semibold block mb-0.5">Where do I upload this policy?</span>
          <span>
            Google Play Console (App content &gt; Privacy Policy) and Apple App Store Connect (App Information &gt; Privacy Policy URL) both require a <strong>publicly accessible HTTPS link</strong>. You can host this file for free using GitHub Pages, Netlify, or by embedding our Standalone HTML file into your domain.
          </span>
        </div>
        <button
          onClick={handleDownloadHtml}
          className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          Download Hostable HTML
        </button>
      </div>
    </div>
  );
};
