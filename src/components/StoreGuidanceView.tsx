import React, { useState } from 'react';
import { PolicyConfig } from '../types/policy';
import { getGooglePlayDataSafetyGuidance, getAppleNutritionLabelsGuidance } from '../utils/storeComplianceHelper';
import { Copy, Check, ShieldAlert, CheckCircle2, AlertCircle, FileCode, ExternalLink } from 'lucide-react';

import { copyToClipboard } from '../utils/clipboard';

interface StoreGuidanceViewProps {
  config: PolicyConfig;
}

export const StoreGuidanceView: React.FC<StoreGuidanceViewProps> = ({ config }) => {
  const playSafety = getGooglePlayDataSafetyGuidance(config);
  const appleNutrition = getAppleNutritionLabelsGuidance(config);

  const [copiedFs, setCopiedFs] = useState(false);

  const copyFsDeclaration = async () => {
    if (!playSafety.foregroundServiceDeclaration) return;
    const success = await copyToClipboard(playSafety.foregroundServiceDeclaration);
    if (success) {
      setCopiedFs(true);
      setTimeout(() => setCopiedFs(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Google Play Console</span>
              <span aria-hidden="true">·</span>
              <span>Apple App Store Connect</span>
              <span aria-hidden="true">·</span>
              <span>Target SDK 34/35 Rules</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Store Questionnaire & Data Safety Cheat Sheet
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Exact answers and declarations required when submitting {config.appName} to Google Play and Apple App Store.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-300 font-mono shrink-0">
            Status: {config.dataCollectionMode === 'none_local_only' ? 'Zero Data Collection' : 'Data Disclosed'}
          </div>
        </div>
      </div>

      {/* Google Play Console Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block">
              Google Play Console
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Data Safety Form Guidance
            </h3>
          </div>
          <span className="text-xs text-slate-400">Play Console &gt; App content &gt; Data safety</span>
        </div>

        <div className="space-y-4">
          {playSafety.declarations.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {idx + 1}. {item.question}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded shrink-0 ${
                    item.recommendedAnswer.startsWith('No')
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60'
                  }`}
                >
                  Answer: {item.recommendedAnswer}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Rationale for Play Console Reviewers: </strong>
                {item.rationale}
              </p>
            </div>
          ))}

          {/* Android 14+ Foreground Service Declaration */}
          {playSafety.foregroundServiceDeclaration && (
            <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                    Target SDK 34+ Foreground Service (Media Playback) Declaration
                  </span>
                </div>
                <button
                  onClick={copyFsDeclaration}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors whitespace-nowrap shrink-0"
                >
                  {copiedFs ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Copied Rationale!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Play Console Text</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Google Play will reject apps targeting Android 14+ that declare <code className="text-indigo-300 font-mono">FOREGROUND_SERVICE</code> without submitting this exact video/text declaration:
              </p>
              <pre className="p-3 bg-slate-950 rounded border border-indigo-900/50 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {playSafety.foregroundServiceDeclaration}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Apple App Store Connect Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block">
              Apple App Store Connect
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              App Privacy Nutrition Labels
            </h3>
          </div>
          <span className="text-xs text-slate-400">App Store Connect &gt; App Privacy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {appleNutrition.map((label, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-1">{label.category}</span>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-3 ${
                    label.status === 'None'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {label.status}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{label.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Prevention Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Top App Store Rejection Traps & How to Avoid Them</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">1. Public HTTPS URL (No Login Required)</span>
            <p className="text-slate-400 leading-relaxed">
              Google Play and Apple reviewers will immediately reject submissions if your privacy policy URL requires a login, leads to a 404, or is behind an intranet. Use GitHub Pages or our standalone HTML export.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">2. In-App vs. Play Console Consistency</span>
            <p className="text-slate-400 leading-relaxed">
              If your code contains AdMob or Firebase, do NOT select "No data collected" in the Play Console Data Safety form. Google automated static analyzers scan SDK binaries in your APK/AAB and will flag contradictions.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">3. Mandatory Account Deletion Link</span>
            <p className="text-slate-400 leading-relaxed">
              If your app offers user account registration, Google Play (2024 policy) and Apple Guideline 5.1.1(v) strictly mandate an in-app deletion button AND an external web deletion request URL where users can request erasure without reinstalling the app.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-100 block">4. Prominent Disclosure for Audio & Media Access</span>
            <p className="text-slate-400 leading-relaxed">
              When requesting <code className="font-mono text-slate-200">READ_MEDIA_AUDIO</code>, ensure your in-app onboarding dialog explicitly tells the user why local audio access is required before triggering the system permission prompt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
