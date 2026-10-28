import React, { useRef } from 'react';
import { PolicyConfig } from '../types/policy';
import { generatePlainTextPolicy, generateStandaloneHtml } from '../utils/policyGenerator';
import { Printer, Download, ExternalLink, Globe, Shield } from 'lucide-react';

interface PublicWebPreviewProps {
  config: PolicyConfig;
}

export const PublicWebPreview: React.FC<PublicWebPreviewProps> = ({ config }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('window.print is blocked by sandbox iframe, downloading HTML instead:', err);
      handleDownloadHtml();
    }
  };

  const handleDownloadHtml = () => {
    const filename = `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_privacy_policy.html`;
    const content = generateStandaloneHtml(config);
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const simulatedUrl = config.websiteUrl
    ? `${config.websiteUrl.replace(/\/$/, '')}/privacy`
    : `https://${config.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/privacy/${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Public Policy Host Simulation</span>
              <span aria-hidden="true">·</span>
              <span>Web & Mobile Web Ready</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hostable Public Privacy Policy Page
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Preview how store reviewers and users view your policy on a public HTTPS URL.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML for Hosting</span>
            </button>
          </div>
        </div>

        {/* Browser URL Simulation Bar */}
        <div className="mt-4 flex items-center gap-2 bg-slate-950 border border-slate-800/80 px-3.5 py-2 rounded-lg text-xs font-mono text-slate-400">
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-emerald-400 font-semibold shrink-0">https://</span>
          <span className="text-slate-200 truncate">{simulatedUrl.replace(/^https?:\/\//, '')}</span>
          <span className="ml-auto text-[10px] text-slate-500 font-sans hidden sm:inline">
            Publicly Accessible · No Login Required
          </span>
        </div>
      </div>

      {/* Styled Web Document Container */}
      <div className="bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="max-w-4xl mx-auto p-6 sm:p-12 lg:p-16">
          {/* Document Header */}
          <header className="mb-10 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              <span>{config.companyName} · Legal Compliance Disclosure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Privacy Policy for {config.appName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>App Type: <strong className="text-slate-700">{config.appType}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Effective Date: <strong className="text-slate-700">{config.effectiveDate}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Jurisdiction: <strong className="text-slate-700">{config.country}</strong></span>
            </div>
          </header>

          {/* Document Body */}
          <div ref={printAreaRef} className="space-y-8 text-sm text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                1. Introduction & Scope
              </h2>
              <p className="mb-3">
                This Privacy Policy (&quot;Policy&quot;) describes how <strong>{config.companyName}</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;the Developer&quot;), located in <strong>{config.country}</strong>, collects, uses, protects, and discloses information when you download, install, access, or use <strong>{config.appName}</strong> (the &quot;Application&quot;), categorized as an <strong>{config.appType}</strong>.
              </p>
              <p>
                This Policy applies to all users of the Application distributed via the Google Play Store, Apple App Store, and associated distribution channels. We are committed to maintaining the privacy and security of your personal information in strict compliance with applicable data protection laws.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                2. Information Collection and Use
              </h2>
              {config.dataCollectionMode === 'none_local_only' ? (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-lg text-emerald-950 text-xs sm:text-sm space-y-2">
                  <span className="font-bold text-emerald-900 block">Zero Remote Data Collection Architecture</span>
                  <p>
                    <strong>{config.appName}</strong> is architected as a privacy-first, locally executed application. All media indexing, audio playback, playlist generation, audio equalization, and user configuration occur strictly and exclusively in volatile local memory on your physical device. Your files, track titles, album artwork, and folder structures are never uploaded, synchronized, or transmitted to any remote servers, cloud infrastructure, or third parties.
                  </p>
                </div>
              ) : (
                <p>
                  The Application collects minimal technical telemetry strictly necessary for application functionality, stability, or advertising delivery as configured.
                </p>
              )}
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                3. Device Permissions & Purpose
              </h2>
              <p className="mb-4">
                To deliver its core features, <strong>{config.appName}</strong> requests specific runtime or manifest permissions on your mobile operating system. Permissions are used exclusively for their declared functionality:
              </p>
              <div className="space-y-3">
                {config.permissions.map((permId) => (
                  <div key={permId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="font-mono font-bold text-indigo-900 block mb-0.5">{permId}</span>
                    <span className="text-slate-600 block">
                      Required for active application functionality as configured in accordance with store review guidelines.
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                4. Third-Party Services & Links
              </h2>
              {config.thirdPartySdks.length === 0 ? (
                <p>
                  <strong>{config.appName}</strong> does not integrate any third-party software development kits (SDKs), advertising networks, behavioral tracking tools, social media plugins, or external telemetry libraries.
                </p>
              ) : (
                <p>
                  The Application utilizes certified third-party SDKs to provide analytics, ads, or gaming services. Direct hyperlinks to each provider’s respective privacy policy are maintained in the plain-text policy document.
                </p>
              )}
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                5. Data Retention & Deletion
              </h2>
              <p className="mb-2">{config.dataRetentionDescription}</p>
              {config.hasUserAccounts && config.accountDeletionUrl && (
                <p className="text-xs text-indigo-800 bg-indigo-50 p-3 rounded border border-indigo-200">
                  Users can initiate account and data erasure in-app or via our public deletion portal: <strong>{config.accountDeletionUrl}</strong>
                </p>
              )}
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                6. Children&apos;s Privacy
              </h2>
              <p>
                <strong>{config.appName}</strong> is intended for a{' '}
                {config.targetAudience === 'under_13'
                  ? 'audience including children under 13 and complies with COPPA and Google Play Families Policy.'
                  : 'general audience aged 13 and above and does not knowingly collect personal information from children.'}
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                7. Changes to This Privacy Policy
              </h2>
              <p>
                We may periodically update this Privacy Policy. Modifications will be posted with an updated effective date. Continued use of the Application signifies acceptance of revised terms.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                8. Contact Information
              </h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-1">
                <div><strong className="text-slate-800">Developer:</strong> {config.companyName}</div>
                <div><strong className="text-slate-800">Country:</strong> {config.country}</div>
                <div><strong className="text-slate-800">Support Email:</strong> {config.supportEmail}</div>
                {config.websiteUrl && <div><strong className="text-slate-800">Website:</strong> {config.websiteUrl}</div>}
              </div>
            </section>
          </div>

          <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400 text-center">
            &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};
