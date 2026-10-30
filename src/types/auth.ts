export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'barista' | 'vip';
  membershipTier: string | null;
  membershipStatus: 'active' | 'paused' | 'none';
  frequency: 'biweekly' | 'monthly' | null;
  nextDeliveryDate: string | null;
  grindPreference: string;
  roastPreference: string;
  deliveryAddress: string;
  createdAt: string;
  systemeContactId?: string;
  isSyncedToSysteme: boolean;
}

export interface SystemeWorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  action: string;
  status: 'active' | 'queued' | 'completed';
  details: string;
}

export interface SystemeConfig {
  formActionUrl: string;
  webhookUrl: string;
  autoSyncOnSignup: boolean;
  tag: string;
  workflowUrl: string;
  workflowHash: string;
  workflowType: string;
}

export interface SystemeSyncLog {
  id: string;
  timestamp: string;
  email: string;
  name: string;
  tier: string;
  status: 'synced' | 'pending' | 'simulated';
  payload: Record<string, unknown>;
  workflowTriggered?: boolean;
  workflowHash?: string;
}
