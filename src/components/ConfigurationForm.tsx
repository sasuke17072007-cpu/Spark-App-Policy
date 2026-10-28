import React from 'react';
import { PolicyConfig, TargetAudience, DataCollectionMode } from '../types/policy';
import { AVAILABLE_PERMISSIONS, AVAILABLE_SDKS, PRESET_POLICIES } from '../data/defaults';
import { Sliders, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ConfigurationFormProps {
  config: PolicyConfig;
  onChange: (updated: PolicyConfig) => void;
  onSelectPreset: (presetId: string) => void;
  onGenerateAndReview: () => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  config,
  onChange,
  onSelectPreset,
  onGenerateAndReview,
}) => {
  const updateField = <K extends keyof PolicyConfig>(field: K, value: PolicyConfig[K]) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const togglePermission = (permId: string) => {
    const exists = config.permissions.includes(permId);
    const updated = exists
      ? config.permissions.filter((p) => p !== permId)
      : [...config.permissions, permId];
    updateField('permissions', updated);
  };

  const toggleSdk = (sdkId: string) => {
    const exists = config.thirdPartySdks.includes(sdkId);
    const updated = exists
      ? config.thirdPartySdks.filter((s) => s !== sdkId)
      : [...config.thirdPartySdks, sdkId];
    updateField('thirdPartySdks', updated);
  };

  return (
    <div className="space-y-8">
      {/* Header and Preset Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">App & Developer Profile Configuration</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a store-tested template or configure your permissions, data handling, and third-party SDKs.
            </p>
          </div>
          <button
            onClick={onGenerateAndReview}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Generate & Review Policy</span>
          </button>
        </div>

        {/* Presets Grid */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
            Quick Compliance Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_POLICIES.map((preset) => {
              const isActive =
                config.appName === preset.config.appName &&
                config.appType === preset.config.appType;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-100 truncate">{preset.name}</span>
                    {isActive && (
                      <span className="text-[10px] font-semibold text-indigo-400 font-mono">Active</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 1: Developer & App Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span>01. Developer Entity & Application Scope</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Company / Developer Name
            </label>
            <input
              type="text"
              value={config.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="e.g. Spark"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Country / Jurisdiction
            </label>
            <input
              type="text"
              value={config.country}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder="e.g. India"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              App Name
            </label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => updateField('appName', e.target.value)}
              placeholder="e.g. Luumo"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Type of App
            </label>
            <input
              type="text"
              value={config.appType}
              onChange={(e) => updateField('appType', e.target.value)}
              placeholder="e.g. Offline Media Player / 2D Action Mobile Game"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Audience
            </label>
            <select
              value={config.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value as TargetAudience)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="general_13_plus">General audience aged 13+</option>
              <option value="all_ages">All ages (including families)</option>
              <option value="under_13">Children under 13 (COPPA & Families Policy strict)</option>
              <option value="adults_only">Adults 18+ only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Support Contact Email
            </label>
            <input
              type="email"
              value={config.supportEmail}
              onChange={(e) => updateField('supportEmail', e.target.value)}
              placeholder="e.g. support@spark.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Effective Date
            </label>
            <input
              type="text"
              value={config.effectiveDate}
              onChange={(e) => updateField('effectiveDate', e.target.value)}
              placeholder="e.g. October 28, 2026"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Website / Support URL (Optional)
            </label>
            <input
              type="url"
              value={config.websiteUrl}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              placeholder="e.g. https://spark.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Data Handling & Storage Model */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-2">
          02. Information Collection, Storage & Accounts
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Defines the data governance model for Google Play Data Safety and Apple Privacy Nutrition labels.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Data Collection Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'none_local_only',
                  title: 'None (100% Local Execution)',
                  desc: 'App operates entirely on-device. Zero data leaves the phone. Ideal for offline media players, tools, and local games.',
                },
                {
                  id: 'anonymous_crash_logs',
                  title: 'Anonymous Crash Diagnostics Only',
                  desc: 'No personal identity is collected. Only de-identified crash stack traces to fix bugs.',
                },
                {
                  id: 'analytics_and_ads',
                  title: 'Ad Networks & Telemetry',
                  desc: 'AdMob / Unity Ads or analytics SDKs collect advertising identifiers and coarse usage telemetry.',
                },
                {
                  id: 'user_account_cloud',
                  title: 'User Accounts & Cloud Sync',
                  desc: 'Users sign up or log in; profiles, cloud saves, and personal records are stored on remote servers.',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateField('dataCollectionMode', item.id as DataCollectionMode)}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    config.dataCollectionMode === item.id
                      ? 'bg-indigo-950/40 border-indigo-500 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-100 mb-1">{item.title}</div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasUserAccounts}
                onChange={(e) => updateField('hasUserAccounts', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">User Accounts Required</span>
                <span className="text-[11px] text-slate-400 block">Requires account deletion flow</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasInAppPurchases}
                onChange={(e) => updateField('hasInAppPurchases', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">In-App Purchases (IAP)</span>
                <span className="text-[11px] text-slate-400 block">Handled by Play Store / App Store</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={config.remoteDataStorage}
                onChange={(e) => updateField('remoteDataStorage', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Remote Database / Cloud</span>
                <span className="text-[11px] text-slate-400 block">External server retention</span>
              </div>
            </label>
          </div>

          {config.hasUserAccounts && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Public Web Account Deletion URL (Mandatory for Google Play 2024+ & Apple StoreKit)
              </label>
              <input
                type="url"
                value={config.accountDeletionUrl}
                onChange={(e) => updateField('accountDeletionUrl', e.target.value)}
                placeholder="e.g. https://sparkgames.in/delete-account"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Data Retention Description
            </label>
            <textarea
              rows={2}
              value={config.dataRetentionDescription}
              onChange={(e) => updateField('dataRetentionDescription', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Device Permissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-semibold text-white">03. Device Permissions & Target SDK Rules</h3>
            <p className="text-xs text-slate-400">
              Only select permissions your app actually requests in its AndroidManifest.xml or Info.plist.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {config.permissions.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {AVAILABLE_PERMISSIONS.map((perm) => {
            const isChecked = config.permissions.includes(perm.id);
            return (
              <div
                key={perm.id}
                onClick={() => togglePermission(perm.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-indigo-950/40 border-indigo-500/80'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by div
                    className="w-4 h-4 mt-0.5 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-100 truncate">{perm.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{perm.platform}</span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 block mb-1 truncate">
                      {perm.technicalKey}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {perm.purposeText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Third-Party SDKs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-semibold text-white">04. Third-Party SDKs & Advertising Partners</h3>
            <p className="text-xs text-slate-400">
              Google Play and Apple App Store mandate direct hyperlinks to each integrated SDK’s privacy policy.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {config.thirdPartySdks.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {AVAILABLE_SDKS.map((sdk) => {
            const isChecked = config.thirdPartySdks.includes(sdk.id);
            return (
              <div
                key={sdk.id}
                onClick={() => toggleSdk(sdk.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-indigo-950/40 border-indigo-500/80'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-semibold text-slate-100 truncate">{sdk.name}</span>
                      <span className="text-[10px] text-slate-400">{sdk.category}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mb-1">Provider: {sdk.provider}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{sdk.privacyUrl}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
