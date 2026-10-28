/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRESET_POLICIES } from './data/defaults';
import { PolicyConfig } from './types/policy';
import { generatePlainTextPolicy } from './utils/policyGenerator';
import { Header } from './components/Header';
import { PlainTextPolicyView } from './components/PlainTextPolicyView';
import { ConfigurationForm } from './components/ConfigurationForm';
import { StoreGuidanceView } from './components/StoreGuidanceView';
import { AiPolicyAuditor } from './components/AiPolicyAuditor';
import { PublicWebPreview } from './components/PublicWebPreview';
import { FileText, Sliders, ShieldCheck, Sparkles, Globe } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<PolicyConfig>(PRESET_POLICIES[0].config);
  const [activeTab, setActiveTab] = useState<
    'plain_text' | 'configure' | 'store_guidance' | 'ai_audit' | 'web_preview'
  >('plain_text');
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyPlainText = () => {
    const text = generatePlainTextPolicy(config);
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_POLICIES.find((p) => p.id === presetId);
    if (found) {
      setConfig({ ...found.config });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyPlainText={handleCopyPlainText}
        hasCopied={hasCopied}
        appName={config.appName}
      />

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        {[
          { id: 'plain_text', label: 'Plain Text' },
          { id: 'configure', label: 'App Config' },
          { id: 'store_guidance', label: 'Store Guides' },
          { id: 'ai_audit', label: 'Auditor' },
          { id: 'web_preview', label: 'Public View' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as 'plain_text' | 'configure' | 'store_guidance' | 'ai_audit' | 'web_preview'
              )
            }
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'plain_text' && (
          <PlainTextPolicyView
            config={config}
            onCopyPlainText={handleCopyPlainText}
            hasCopied={hasCopied}
            onNavigateToConfig={() => setActiveTab('configure')}
            onNavigateToGuidance={() => setActiveTab('store_guidance')}
          />
        )}

        {activeTab === 'configure' && (
          <ConfigurationForm
            config={config}
            onChange={setConfig}
            onSelectPreset={handleSelectPreset}
            onGenerateAndReview={() => setActiveTab('plain_text')}
          />
        )}

        {activeTab === 'store_guidance' && <StoreGuidanceView config={config} />}

        {activeTab === 'ai_audit' && (
          <AiPolicyAuditor
            config={config}
            onNavigateToConfig={() => setActiveTab('configure')}
          />
        )}

        {activeTab === 'web_preview' && <PublicWebPreview config={config} />}
      </main>

      {/* Clean Unboxed Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>AppPolicy Spec</span>
            <span aria-hidden="true">·</span>
            <span>Mobile App & Game Legal Compliance Specialist</span>
            <span aria-hidden="true">·</span>
            <span>Target SDK 34+ Ready</span>
          </div>
          <div>
            <span>Google Play Developer Program & Apple App Store Review 5.1.1 Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
