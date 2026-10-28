import { PolicyConfig } from '../types/policy';
import { AVAILABLE_PERMISSIONS, AVAILABLE_SDKS } from '../data/defaults';

/**
 * Generates a complete, plain-text Privacy Policy suitable for the Google Play Store and Apple App Store.
 */
export function generatePlainTextPolicy(config: PolicyConfig): string {
  const {
    companyName,
    country,
    appName,
    appType,
    targetAudience,
    supportEmail,
    effectiveDate,
    websiteUrl,
    permissions,
    dataCollectionMode,
    thirdPartySdks,
    hasUserAccounts,
    accountDeletionUrl,
    hasInAppPurchases,
    remoteDataStorage,
    dataRetentionDescription,
    customClauses,
  } = config;

  const activePermissions = AVAILABLE_PERMISSIONS.filter((p) => permissions.includes(p.id));
  const activeSdks = AVAILABLE_SDKS.filter((s) => thirdPartySdks.includes(s.id));

  const isOfflineOnly = dataCollectionMode === 'none_local_only';
  const isChildrenTarget = targetAudience === 'under_13';

  const audienceLabel =
    targetAudience === 'under_13'
      ? 'Children under the age of 13'
      : targetAudience === 'general_13_plus'
      ? 'General audience aged 13 and above'
      : targetAudience === 'adults_only'
      ? 'Adults aged 18 and above'
      : 'General audiences of all ages';

  const sections: string[] = [];

  // Header
  sections.push(`PRIVACY POLICY FOR ${appName.toUpperCase()}
Last updated: ${effectiveDate}
Effective date: ${effectiveDate}

================================================================================
1. INTRODUCTION & SCOPE
================================================================================

This Privacy Policy ("Policy") describes how ${companyName} ("we", "us", "our", or "the Developer"), located in ${country}, collects, uses, protects, and discloses information when you download, install, access, or use ${appName} (the "Application" or "App"), categorized as an ${appType}.

This Policy applies to all users of the Application distributed via the Google Play Store, Apple App Store, and any associated distribution channels. We are committed to maintaining the privacy and security of your personal information in strict compliance with applicable data protection laws, including the Google Play Developer Program Policies, Apple App Store Review Guidelines, the Children's Online Privacy Protection Act (COPPA), the General Data Protection Regulation (GDPR / UK GDPR), California Consumer Privacy Act (CCPA/CPRA), and the Indian Digital Personal Data Protection Act (DPDP Act 2023).

By installing or using the Application, you acknowledge that you have read, understood, and agreed to the practices described in this Privacy Policy. If you do not agree with this Policy, please do not install or use ${appName}.`);

  // Section 2: Information Collection and Use
  let section2Content = `================================================================================
2. INFORMATION COLLECTION AND USE
================================================================================\n\n`;

  if (isOfflineOnly) {
    section2Content += `A. NO PERSONAL DATA COLLECTED
${appName} is architected from the ground up as a privacy-first, locally executed application.

1. Zero Data Collection: We do not collect, transmit, harvest, log, or sell any personal data, personally identifiable information (PII), device identifiers, IP addresses, location data, or network activity.
2. Local Processing of User Content: All media indexing, audio playback, playlist generation, audio equalization, and user configuration occur strictly and exclusively in volatile local memory on your physical device. Your files, track titles, album artwork, and folder structures are never uploaded, synchronized, or transmitted to any remote servers, cloud infrastructure, or third parties.
3. No Telemetry or Profiling: The Application contains zero background telemetry, behavioral analytics, user tracking mechanisms, or device fingerprinting routines.
4. Offline Operational Guarantee: The core functions of ${appName} do not require an active internet connection to operate.`;
  } else if (dataCollectionMode === 'anonymous_crash_logs') {
    section2Content += `A. INFORMATION COLLECTED AUTOMATICALLY
The Application operates with minimal data collection principles:

1. Personal Information: We do not require or collect personal identity information such as your real name, physical address, or contact details.
2. Diagnostic and Crash Logs: To ensure stability and fix bugs, the Application may collect anonymous crash stack traces, device hardware model, operating system version, and general error logs. This technical telemetry is completely de-identified and cannot be used to isolate or identify individual users.
3. Local Content: Any media, audio files, or game saves handled by the App are processed locally on your device and are never transmitted to our servers.`;
  } else {
    section2Content += `A. INFORMATION COLLECTED AUTOMATICALLY & THIRD-PARTY INTEGRATIONS
Depending on your usage of the Application, the following categories of data may be processed:

1. Device & Technical Identifiers: Operating system type and version, device model, hardware specifications, coarse geographic location (country/city level derived from IP address), and mobile advertising identifiers (such as Google Advertising ID or Apple IDFA, subject to your tracking permission).
2. Gameplay & Usage Metrics: In-game session length, level progression milestones, virtual currency balances, and interaction with game features.
3. Crash Diagnostics: Stack traces, memory state at time of exception, and diagnostic logs to resolve software defects.`;
  }

  if (hasUserAccounts) {
    section2Content += `\n\nB. USER ACCOUNT DATA
When you create an account within ${appName}, we may store your registered username, encrypted password hash, and authenticated email address to maintain your gameplay profile, achievements, and cross-device cloud saves. We do not sell your personal account information to any third party.`;
  } else {
    section2Content += `\n\nB. USER ACCOUNTS & AUTHENTICATION
${appName} does not require, provide, or solicit user account registration, profile creation, or social media logins. You can enjoy the full capabilities of the Application without submitting any credentials, phone numbers, or email addresses.`;
  }

  if (hasInAppPurchases) {
    section2Content += `\n\nC. FINANCIAL & PAYMENT INFORMATION
All monetary transactions, in-app purchases, or digital content purchases within the Application are processed directly by Google Play Store (Google LLC) or Apple App Store (Apple Inc.) via their official in-app billing APIs. We never receive, collect, or store your credit card numbers, bank account credentials, or financial billing addresses.`;
  }

  sections.push(section2Content);

  // Section 3: Device Permissions & Purpose
  let section3Content = `================================================================================
3. DEVICE PERMISSIONS & PURPOSE
================================================================================

To deliver its core features, ${appName} may request specific runtime or manifest permissions on your mobile operating system. We strictly follow the Principle of Data Minimization: permissions are used exclusively for their declared functionality and are never leveraged for background harvesting or unauthorized surveillance.

Below is the exhaustive list of permissions requested by ${appName} and their explicit operational purpose:
`;

  if (activePermissions.length === 0) {
    section3Content += `\n• No special runtime or sensitive device permissions are requested by the Application.`;
  } else {
    activePermissions.forEach((perm, idx) => {
      section3Content += `\n${idx + 1}. [${perm.platform.toUpperCase()}] ${perm.name}
   Technical Identifier: ${perm.technicalKey}
   Category: ${perm.category}
   Operational Justification: ${perm.purposeText}
`;
    });
  }

  section3Content += `
Permission Management:
You maintain absolute control over these permissions. You can inspect, grant, or revoke any optional permission at any time through your mobile device system settings (Settings > Apps > ${appName} > Permissions). Revoking permissions may restrict certain features (for example, revoking media access will prevent the app from loading local audio tracks).`;

  sections.push(section3Content);

  // Section 4: Third-Party Services & Links
  let section4Content = `================================================================================
4. THIRD-PARTY SERVICES & LINKS
================================================================================\n\n`;

  if (activeSdks.length === 0) {
    section4Content += `A. ZERO THIRD-PARTY SDKs OR TRACKERS
${appName} does NOT integrate any third-party software development kits (SDKs), advertising networks, behavioral tracking tools, social media plugins, or external telemetry libraries.

No third-party partner receives data from your interaction with this Application.`;
  } else {
    section4Content += `A. INTEGRATED THIRD-PARTY LIBRARIES & PARTNERS
To provide advertising, crash reporting, game synchronization, or analytics, ${appName} embeds select third-party SDKs. These service providers may collect pseudonymized identifiers in accordance with their respective privacy policies.

We disclose our integrated partners below, along with direct links to their official privacy policies:
`;

    activeSdks.forEach((sdk, idx) => {
      section4Content += `\n${idx + 1}. ${sdk.name} (${sdk.provider})
   Category: ${sdk.category}
   Data Processed: ${sdk.dataCollectedSummary}
   Privacy Policy: ${sdk.privacyUrl}
`;
    });

    section4Content += `\nWe encourage you to review the privacy practices of these third-party services directly. We do not control their independent data practices beyond the privacy configurations enabled in our code.`;
  }

  section4Content += `\n\nB. EXTERNAL HYPERLINKS
The Application may occasionally display links to external websites (such as support documentation or developer homepages). We are not responsible for the privacy practices, content, or policies of third-party websites or services.`;

  sections.push(section4Content);

  // Section 5: Data Retention & Deletion
  let section5Content = `================================================================================
5. DATA RETENTION & DELETION
================================================================================\n\n`;

  if (isOfflineOnly && !remoteDataStorage && !hasUserAccounts) {
    section5Content += `A. LOCAL DATA STORAGE ONLY - NO SERVER-SIDE RETENTION
Because ${appName} does not transmit, collect, or store any user data on remote servers or cloud databases:

1. Server-Side Records: We do not possess, maintain, or retain any personal records, playback histories, media lists, or device profiles on any server.
2. Complete User Control over Deletion: You possess total sovereignty over your local data. You can permanently erase all local application state, cached album artwork, playback bookmarks, and user preferences at any time by:
   - Clearing Application Data: Open Android / iOS Settings > Apps > ${appName} > Storage > "Clear Data" / "Clear Storage".
   - Uninstalling the Application: Removing ${appName} from your mobile device immediately and permanently deletes the application's isolated local sandbox directory and all configuration files.
3. Media File Integrity: Deleting application data or uninstalling ${appName} does NOT delete your original audio or media files stored in your device's shared storage folders.`;
  } else {
    section5Content += `A. RETENTION PERIODS
${dataRetentionDescription}

B. DATA DELETION PROCEDURES (GOOGLE PLAY & APPLE APP STORE COMPLIANCE)
In accordance with Google Play's Account Deletion Policy and Apple App Store Review Guideline 5.1.1(v):
`;

    if (hasUserAccounts) {
      section5Content += `\n1. In-App Account Deletion: You can delete your account and associated data directly within the Application by navigating to: Settings > Account > Delete Account.
2. Web-Based Account Deletion: If you have uninstalled the app or cannot access your device, you can submit an account and data erasure request via our official deletion portal:
   ${accountDeletionUrl || websiteUrl || 'Contact Support Email: ' + supportEmail}
3. Deletion Timeline: Upon receiving a verified deletion request, all associated personal records and profile identifiers will be permanently removed from our active databases within thirty (30) days, except where retention is legally mandated by financial or tax reporting obligations.`;
    } else {
      section5Content += `\n1. Device Identifiers & Telemetry: Technical crash diagnostics and anonymous advertising identifiers automatically expire according to the retention schedules of the respective SDK providers (typically 30 to 90 days).
2. Resetting Advertising ID: You can reset or opt out of personalized advertising identifiers at any time via your device settings:
   - Android: Settings > Google > Ads > "Reset advertising ID" or "Delete advertising ID".
   - iOS: Settings > Privacy & Security > Tracking > Toggle off "Allow Apps to Request to Track".`;
    }
  }

  sections.push(section5Content);

  // Section 6: Children's Privacy
  let section6Content = `================================================================================
6. CHILDREN'S PRIVACY
================================================================================\n\n`;

  if (isChildrenTarget) {
    section6Content += `A. COPPA & GOOGLE PLAY FAMILIES POLICY COMPLIANCE
${appName} is designed and intended for use by children. Protecting children's privacy is of paramount importance to us.

1. Compliance Standards: We strictly comply with the Children's Online Privacy Protection Act (COPPA), the EU GDPR-K provisions, Google Play Families Policy, and Apple App Store Kids Category requirements.
2. No Personal Information Collection: We do not knowingly collect, request, or store any personally identifiable information from children under 13 years of age (or under 16 in the European Economic Area).
3. Family-Safe Environment: The Application contains no behavioral advertising, interest-based tracking, or open social communications. Any third-party SDKs utilized are certified COPPA-compliant and configured in neutral, non-tracking modes.
4. Parental Rights: Parents and legal guardians have the right to review any information processed, request immediate deletion, and refuse further data handling by contacting us at ${supportEmail}.`;
  } else {
    section6Content += `A. GENERAL AUDIENCE / NOT DIRECTED TO CHILDREN UNDER 13
${appName} is intended for a ${audienceLabel}. The Application is not specifically directed to children under the age of 13 (or under 16 in certain European jurisdictions).

1. No Intentional Collection: We do not knowingly solicit, collect, or maintain personal information from children under the statutory age of consent.
2. Inadvertent Receipt Protocol: If we become aware that personal information from a child under 13 has been inadvertently transmitted to our systems without verified parental consent, we will take immediate steps to purge such information from our records.
3. Parental Inquiries: If you are a parent or guardian and believe that your child has provided personal information through our Application, please contact us immediately at ${supportEmail} so we can take swift corrective measures.`;
  }

  sections.push(section6Content);

  // Section 7: Changes to This Privacy Policy
  sections.push(`================================================================================
7. CHANGES TO THIS PRIVACY POLICY
================================================================================

We may periodically revise or update this Privacy Policy to reflect modifications in our software architecture, legal obligations, or mobile platform policies (including revisions to Google Play or Apple App Store developer program requirements).

Notification of Updates:
When updates are published, we will revise the "Last updated" date at the top of this document. For material modifications that affect your privacy rights, we will provide prominent notice within the Application interface or through release notes on the Google Play Store and Apple App Store.

We recommend checking this Privacy Policy periodically to stay informed about our data protection commitments. Continued use of ${appName} following the posting of an updated Privacy Policy constitutes your acceptance of the revised terms.`);

  // Section 8: Contact Information
  sections.push(`================================================================================
8. CONTACT INFORMATION
================================================================================

If you have any questions, comments, concerns, legal inquiries, or data protection requests regarding this Privacy Policy or the operational practices of ${appName}, please contact our compliance and support team:

Developer / Entity: ${companyName}
Country / Jurisdiction: ${country}
Support Contact Email: ${supportEmail}${websiteUrl ? `\nOfficial Website: ${websiteUrl}` : ''}

Inquiries are typically reviewed and resolved within three (3) business days. For European Union (GDPR), United Kingdom, or California (CCPA) statutory rights requests, please include "Data Privacy Request" in the subject line of your email.`);

  return sections.join('\n\n');
}

/**
 * Generates formatted Markdown for documentation or GitHub repository hosting.
 */
export function generateMarkdownPolicy(config: PolicyConfig): string {
  const plainText = generatePlainTextPolicy(config);
  // Transform standard dividers and headers into Markdown
  return plainText
    .replace(/^PRIVACY POLICY FOR (.*)$/m, '# Privacy Policy for $1\n')
    .replace(/^={10,}$/gm, '')
    .replace(/^[0-9]\. (.*)$/gm, '## $&')
    .replace(/^[A-Z]\. (.*)$/gm, '### $&');
}

/**
 * Generates a clean, standalone, responsive HTML file that developers can save and host on GitHub Pages or their site.
 */
export function generateStandaloneHtml(config: PolicyConfig): string {
  const plainText = generatePlainTextPolicy(config);
  const formattedHtml = plainText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^PRIVACY POLICY FOR (.*)$/gm, '<h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-2">Privacy Policy for $1</h1>')
    .replace(/^={10,}$/gm, '<hr class="my-6 border-slate-200" />')
    .replace(/^[0-9]\. (.*)$/gm, '<h2 class="text-xl font-semibold text-slate-900 mt-8 mb-3 pb-1 border-b border-slate-200">$&</h2>')
    .replace(/^[A-Z]\. (.*)$/gm, '<h3 class="text-base font-semibold text-slate-800 mt-4 mb-2">$&</h3>')
    .replace(/\n\n/g, '</p><p class="text-slate-600 leading-relaxed mb-4">');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy - ${config.appName}</title>
  <meta name="description" content="Privacy Policy for ${config.appName} by ${config.companyName}" />
  <meta name="robots" content="index, follow" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
  <main class="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200">
    <div class="mb-8 pb-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">${config.companyName} · Legal Compliance</span>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">${config.appName} Privacy Policy</h1>
      </div>
      <div class="text-xs text-slate-500 text-right">
        <div>Effective Date: <span class="font-medium text-slate-700">${config.effectiveDate}</span></div>
        <div>Jurisdiction: <span class="font-medium text-slate-700">${config.country}</span></div>
      </div>
    </div>
    
    <div class="prose prose-slate max-w-none text-sm text-slate-600">
      <p class="text-slate-600 leading-relaxed mb-4">${formattedHtml}</p>
    </div>

    <footer class="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400 text-center">
      &copy; ${new Date().getFullYear()} ${config.companyName}. All rights reserved.
    </footer>
  </main>
</body>
</html>`;
}
