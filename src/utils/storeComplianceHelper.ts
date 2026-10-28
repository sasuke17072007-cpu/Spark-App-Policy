import { PolicyConfig } from '../types/policy';
import { AVAILABLE_SDKS } from '../data/defaults';

export interface DataSafetyDeclaration {
  question: string;
  recommendedAnswer: string;
  rationale: string;
}

export interface NutritionLabelItem {
  category: string;
  status: 'None' | 'Collected (Not Linked)' | 'Collected (Linked to You)' | 'Used for Tracking';
  details: string;
}

export function getGooglePlayDataSafetyGuidance(config: PolicyConfig): {
  isCollectingData: boolean;
  declarations: DataSafetyDeclaration[];
  foregroundServiceDeclaration?: string;
} {
  const isOffline = config.dataCollectionMode === 'none_local_only';
  const hasSdks = config.thirdPartySdks.length > 0;
  const hasAccounts = config.hasUserAccounts;

  const declarations: DataSafetyDeclaration[] = [];

  // Question 1: Data Collection & Sharing Overview
  declarations.push({
    question: 'Does your app collect or share any of the required user data types?',
    recommendedAnswer: isOffline ? 'No' : 'Yes',
    rationale: isOffline
      ? 'Because the app operates 100% locally and does not transmit data to any server, select "No". Processing files entirely on-device is not considered "collection" under Google Play rules.'
      : 'Select "Yes" because your third-party SDKs or account systems transmit device identifiers or analytics to remote servers.',
  });

  // Question 2: Encryption in Transit
  declarations.push({
    question: 'Is all of the user data collected by your app encrypted in transit?',
    recommendedAnswer: isOffline ? 'N/A (No data collected)' : 'Yes',
    rationale: isOffline
      ? 'Not applicable since no network transmission occurs.'
      : 'All supported SDKs (AdMob, Firebase, Unity) use modern TLS/HTTPS encryption protocols for all data transmission.',
  });

  // Question 3: User Account & Deletion
  declarations.push({
    question: 'Do you provide a way for users to request that their data be deleted?',
    recommendedAnswer: hasAccounts ? 'Yes' : 'No / N/A (No remote user data)',
    rationale: hasAccounts
      ? 'Google Play requires you to provide both an in-app deletion button and a publicly accessible web deletion URL (e.g. ' +
        (config.accountDeletionUrl || config.websiteUrl || 'your support website') +
        ').'
      : 'Because no user accounts or persistent server records exist, user data deletion requests are not applicable. Users can wipe local data by clearing app storage.',
  });

  // Question 4: Ephemeral Processing
  declarations.push({
    question: 'Is any data processed ephemerally?',
    recommendedAnswer: isOffline ? 'Yes (Local in-memory media processing)' : 'Depends on SDK',
    rationale:
      'Under Google Play definitions, ephemeral processing means data accessed in memory and immediately discarded without being written to disk or transmitted to servers.',
  });

  let foregroundServiceDeclaration: string | undefined;
  if (config.permissions.includes('FOREGROUND_SERVICE_MEDIA_PLAYBACK')) {
    foregroundServiceDeclaration = `Google Play Target SDK 34+ Foreground Service Declaration:
Category: foregroundServiceType="mediaPlayback"
Justification for Play Console:
"${config.appName} is an ${config.appType} that requires the mediaPlayback foreground service type to allow continuous playback of user-selected local audio tracks when the app is running in the background or when the device screen is powered off. The foreground service is initiated strictly upon user action (pressing play) and provides persistent media session notification controls allowing the user to pause, resume, and skip tracks without reopening the application."`;
  }

  return {
    isCollectingData: !isOffline,
    declarations,
    foregroundServiceDeclaration,
  };
}

export function getAppleNutritionLabelsGuidance(config: PolicyConfig): NutritionLabelItem[] {
  const isOffline = config.dataCollectionMode === 'none_local_only';
  const hasSdks = config.thirdPartySdks.length > 0;
  const activeSdkObjects = AVAILABLE_SDKS.filter((s) => config.thirdPartySdks.includes(s.id));
  const hasAds = activeSdkObjects.some((s) => s.category === 'Advertising');
  const hasAnalytics = activeSdkObjects.some((s) => s.category === 'Analytics' || s.category === 'Crash Reporting');

  if (isOffline) {
    return [
      {
        category: 'Data Used to Track You',
        status: 'None',
        details: 'The app does not collect data for tracking purposes across apps and websites owned by other companies.',
      },
      {
        category: 'Data Linked to You',
        status: 'None',
        details: 'No personal data, identifiers, or accounts are linked to the user identity.',
      },
      {
        category: 'Data Not Linked to You',
        status: 'None',
        details: 'Zero diagnostic or usage telemetry collected.',
      },
    ];
  }

  const labels: NutritionLabelItem[] = [];

  labels.push({
    category: 'Data Used to Track You',
    status: hasAds ? 'Used for Tracking' : 'None',
    details: hasAds
      ? 'Advertising identifiers (IDFA) may be used if the user grants App Tracking Transparency (ATT) permission.'
      : 'The app does not track users across external apps and websites.',
  });

  labels.push({
    category: 'Data Linked to You',
    status: config.hasUserAccounts ? 'Collected (Linked to You)' : 'None',
    details: config.hasUserAccounts
      ? 'Contact info (email) and user credentials are tied to the account profile.'
      : 'No personal data is tied to individual identity or account profile.',
  });

  labels.push({
    category: 'Data Not Linked to You',
    status: hasAnalytics ? 'Collected (Not Linked)' : 'None',
    details: hasAnalytics
      ? 'Anonymous crash diagnostics, performance metrics, and coarse usage data collected via SDKs.'
      : 'No unlinked telemetry collected.',
  });

  return labels;
}
