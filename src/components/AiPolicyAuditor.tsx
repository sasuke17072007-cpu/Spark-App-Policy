import React, { useState } from 'react';
import { PolicyConfig, AuditResult } from '../types/policy';
import { generatePlainTextPolicy } from '../utils/policyGenerator';
import { Sparkles, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';

interface AiPolicyAuditorProps {
  config: PolicyConfig;
  onNavigateToConfig: () => void;
}

export const AiPolicyAuditor: React.FC<AiPolicyAuditorProps> = ({ config, onNavigateToConfig }) => {
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const policyText = generatePlainTextPolicy(config);
      const res = await fetch('/api/audit-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyText, appConfig: config }),
      });

      if (!res.ok) {
        throw new Error(`Audit request failed with status ${res.status}`);
      }

      const data = await res.json();
      setAuditResult(data);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setError(error?.message || 'Failed to complete audit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Mobile Legal Compliance</span>
              <span aria-hidden="true">·</span>
              <span>Play Store Policy 2026</span>
              <span aria-hidden="true">·</span>
              <span>App Store Review 5.1</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Store Policy Compliance Auditor
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Audits {config.appName}’s active policy against Target SDK 34+ permissions, data minimization, COPPA, and Apple App Store review guidelines.
            </p>
          </div>

          <button
            onClick={runAudit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shrink-0 shadow-sm shadow-indigo-600/30"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing with Compliance Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Store Compliance Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-200 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Error running audit: {error}. Please verify server connection.</span>
        </div>
      )}

      {!auditResult && !loading && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-8 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Ready to inspect your policy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click "Run Store Compliance Audit" to analyze your draft for common app store rejection causes (such as missing foreground service disclosures, undeclared media permissions, or COPPA discrepancies).
          </p>
          <button
            onClick={runAudit}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Audit Now</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <div>
            <h3 className="text-sm font-semibold text-white">Auditing Policy Clauses & Store Rules...</h3>
            <p className="text-xs text-slate-400 mt-1">
              Checking Google Play Target SDK 34 rules, Apple Review Guideline 5.1.1, and COPPA declarations.
            </p>
          </div>
        </div>
      )}

      {auditResult && !loading && (
        <div className="space-y-6">
          {/* Score & Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Audit Verdict
                </span>
                <p className="text-sm text-slate-200 font-medium">{auditResult.summary}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Compliance Rating</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{auditResult.score}</span>
                </div>
              </div>
            </div>

            {/* Store Readiness Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4">
                <span className="text-xs font-bold text-slate-200 block mb-1">
                  Google Play Store Readiness
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {auditResult.storeReadiness.googlePlay}
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4">
                <span className="text-xs font-bold text-slate-200 block mb-1">
                  Apple App Store Readiness
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {auditResult.storeReadiness.appleAppStore}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Compliance Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {auditResult.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Actionable Recommendations & Risk Watch</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {auditResult.recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
