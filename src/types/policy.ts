export type TargetAudience = 'general_13_plus' | 'all_ages' | 'under_13' | 'adults_only';

export type DataCollectionMode = 'none_local_only' | 'anonymous_crash_logs' | 'analytics_and_ads' | 'user_account_cloud';

export interface AppPermission {
  id: string;
  name: string;
  platform: 'Android' | 'iOS' | 'Both';
  category: 'Storage & Media' | 'System & Performance' | 'Network' | 'Hardware' | 'Location' | 'Notifications';
  technicalKey: string;
  recommendedFor: string[];
  purposeText: string;
}

export interface ThirdPartySdk {
  id: string;
  name: string;
  provider: string;
  category: 'Advertising' | 'Analytics' | 'Gaming Services' | 'Crash Reporting' | 'Payments' | 'Backend';
  privacyUrl: string;
  dataCollectedSummary: string;
}

export interface PolicyConfig {
  companyName: string;
  country: string;
  appName: string;
  appType: string;
  targetAudience: TargetAudience;
  supportEmail: string;
  effectiveDate: string;
  websiteUrl: string;
  permissions: string[];
  dataCollectionMode: DataCollectionMode;
  thirdPartySdks: string[];
  hasUserAccounts: boolean;
  accountDeletionUrl: string;
  hasInAppPurchases: boolean;
  remoteDataStorage: boolean;
  dataRetentionDescription: string;
  customClauses?: string;
}

export interface AuditResult {
  summary: string;
  score: 'A+' | 'A' | 'B' | 'C';
  storeReadiness: {
    googlePlay: string;
    appleAppStore: string;
  };
  strengths: string[];
  recommendations: string[];
}
