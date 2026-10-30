import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SystemeConfig, SystemeSyncLog } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    pass: string,
    tier?: string,
    grind?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLogin: (userKey: 'julian' | 'elena') => void;
  updateUser: (updates: Partial<User>) => void;
  subscribeToPlan: (
    tierName: string,
    frequency: 'biweekly' | 'monthly',
    grindPref?: string,
    syncToSysteme?: boolean
  ) => Promise<{ success: boolean; log: SystemeSyncLog }>;
  cancelSubscription: () => void;
  systemeConfig: SystemeConfig;
  updateSystemeConfig: (config: Partial<SystemeConfig>) => void;
  systemeLogs: SystemeSyncLog[];
  submitDirectToSysteme: (data: {
    name: string;
    email: string;
    tier: string;
    frequency: string;
    grind: string;
  }) => Promise<{ success: boolean; log: SystemeSyncLog }>;
}

const DEFAULT_SYSTEME_CONFIG: SystemeConfig = {
  formActionUrl: 'https://systeme.io/embedded/form/submit', // configurable by user
  webhookUrl: 'https://api.systeme.io/api/contacts',
  autoSyncOnSignup: true,
  tag: 'OBSIDIAN_VIP_RESERVE',
  workflowUrl: 'https://systeme.io/dashboard/share?hash=EGNhELwpjHFAq8j4SqNECm&type=Workflow',
  workflowHash: 'EGNhELwpjHFAq8j4SqNECm',
  workflowType: 'Workflow',
};

const SEED_USERS: User[] = [
  {
    id: 'usr_julian_01',
    name: 'Julian Vance',
    email: 'julian@obsidianbrew.com',
    role: 'vip',
    membershipTier: 'Cup of Excellence Vault',
    membershipStatus: 'active',
    frequency: 'biweekly',
    nextDeliveryDate: 'Nov 6, 2026',
    grindPreference: 'Espresso Fine (9 Bar)',
    roastPreference: 'Light Scandinavian (L1)',
    deliveryAddress: '420 Mission St, Apt 28B, San Francisco, CA',
    createdAt: '2026-08-15',
    systemeContactId: 'sys_contact_98231',
    isSyncedToSysteme: true,
  },
  {
    id: 'usr_elena_02',
    name: 'Elena Rostova',
    email: 'elena@nocturnallab.dev',
    role: 'member',
    membershipTier: 'Nocturnal Cold Extract',
    membershipStatus: 'active',
    frequency: 'monthly',
    nextDeliveryDate: 'Nov 12, 2026',
    grindPreference: 'Cold Extraction Ultra-Fine',
    roastPreference: 'Medium-Dark Slow Roast (L3)',
    deliveryAddress: '100 King St W, Toronto, ON',
    createdAt: '2026-09-02',
    systemeContactId: 'sys_contact_55140',
    isSyncedToSysteme: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('obsidian_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [systemeConfig, setSystemeConfig] = useState<SystemeConfig>(() => {
    try {
      const stored = localStorage.getItem('obsidian_systeme_config');
      return stored ? JSON.parse(stored) : DEFAULT_SYSTEME_CONFIG;
    } catch {
      return DEFAULT_SYSTEME_CONFIG;
    }
  });

  const [systemeLogs, setSystemeLogs] = useState<SystemeSyncLog[]>(() => {
    try {
      const stored = localStorage.getItem('obsidian_systeme_logs');
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'log_seed_1',
              timestamp: new Date().toLocaleTimeString(),
              email: 'julian@obsidianbrew.com',
              name: 'Julian Vance',
              tier: 'Cup of Excellence Vault',
              status: 'synced',
              payload: {
                email: 'julian@obsidianbrew.com',
                first_name: 'Julian',
                tag: 'OBSIDIAN_VIP_RESERVE',
                frequency: 'biweekly',
              },
            },
          ];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('obsidian_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('obsidian_current_user');
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('obsidian_systeme_config', JSON.stringify(systemeConfig));
    } catch {
      // Ignore storage errors
    }
  }, [systemeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('obsidian_systeme_logs', JSON.stringify(systemeLogs));
    } catch {
      // Ignore storage errors
    }
  }, [systemeLogs]);

  // Push log entry
  const addSystemeLog = (log: SystemeSyncLog) => {
    setSystemeLogs((prev) => [log, ...prev].slice(0, 30));
  };

  // Dispatch payload to Systeme.io
  const submitDirectToSysteme = async (data: {
    name: string;
    email: string;
    tier: string;
    frequency: string;
    grind: string;
  }): Promise<{ success: boolean; log: SystemeSyncLog }> => {
    const payload = {
      email: data.email,
      first_name: data.name.split(' ')[0],
      last_name: data.name.split(' ').slice(1).join(' ') || '',
      tags: [systemeConfig.tag, `TIER_${data.tier.replace(/\s+/g, '_').toUpperCase()}`],
      custom_fields: {
        coffee_tier: data.tier,
        delivery_frequency: data.frequency,
        grind_size: data.grind,
        systeme_workflow_hash: systemeConfig.workflowHash,
        systeme_workflow_type: systemeConfig.workflowType,
        source: 'Obsidian Brew Applet',
      },
      workflow: {
        hash: systemeConfig.workflowHash,
        url: systemeConfig.workflowUrl,
        type: systemeConfig.workflowType,
      },
      registered_at: new Date().toISOString(),
    };

    let syncStatus: 'synced' | 'simulated' = 'synced';

    // Attempt real webhook / POST if user provided a valid external URL
    if (systemeConfig.formActionUrl && systemeConfig.formActionUrl.startsWith('http')) {
      try {
        // We use mode: 'no-cors' so even external Systeme.io endpoints accept form submits
        await fetch(systemeConfig.formActionUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        syncStatus = 'synced';
      } catch {
        syncStatus = 'simulated';
      }
    } else {
      syncStatus = 'simulated';
    }

    const logEntry: SystemeSyncLog = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      email: data.email,
      name: data.name,
      tier: data.tier,
      status: syncStatus,
      payload,
      workflowTriggered: true,
      workflowHash: systemeConfig.workflowHash,
    };

    addSystemeLog(logEntry);
    return { success: true, log: logEntry };
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // Check seed or existing user
    const matched = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return { success: true };
    }

    // Allow user who previously signed up in localStorage
    try {
      const storedUserList = localStorage.getItem('obsidian_all_users');
      if (storedUserList) {
        const users: User[] = JSON.parse(storedUserList);
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          setCurrentUser(found);
          return { success: true };
        }
      }
    } catch {
      // Fallback
    }

    // Create an active session for the provided email if credentials look valid
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'member',
      membershipTier: null,
      membershipStatus: 'none',
      frequency: null,
      nextDeliveryDate: null,
      grindPreference: 'Espresso Fine (9 Bar)',
      roastPreference: 'Medium Roast (L2)',
      deliveryAddress: 'Not yet configured',
      createdAt: new Date().toISOString().split('T')[0],
      isSyncedToSysteme: false,
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    tier = 'Cup of Excellence Vault',
    grind = 'Whole Bean'
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) return { success: false, error: 'Please provide your full name.' };
    if (!email.trim() || !email.includes('@')) return { success: false, error: 'Please enter a valid email address.' };
    if (pass.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'member',
      membershipTier: tier,
      membershipStatus: 'active',
      frequency: 'biweekly',
      nextDeliveryDate: 'Nov 9, 2026',
      grindPreference: grind,
      roastPreference: 'Light Roast (L1)',
      deliveryAddress: '124 Market Street, Suite 400',
      createdAt: new Date().toISOString().split('T')[0],
      isSyncedToSysteme: true,
    };

    // Save into list
    try {
      const existing = localStorage.getItem('obsidian_all_users');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newUser);
      localStorage.setItem('obsidian_all_users', JSON.stringify(list));
    } catch {
      // Ignore
    }

    setCurrentUser(newUser);

    // Auto-sync with Systeme.io
    if (systemeConfig.autoSyncOnSignup) {
      await submitDirectToSysteme({
        name,
        email,
        tier,
        frequency: 'biweekly',
        grind,
      });
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLogin = (userKey: 'julian' | 'elena') => {
    const target = userKey === 'julian' ? SEED_USERS[0] : SEED_USERS[1];
    setCurrentUser(target);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  const subscribeToPlan = async (
    tierName: string,
    frequency: 'biweekly' | 'monthly',
    grindPref = 'Espresso Fine (9 Bar)',
    syncToSysteme = true
  ): Promise<{ success: boolean; log: SystemeSyncLog }> => {
    const updatedUser: User = currentUser
      ? {
          ...currentUser,
          membershipTier: tierName,
          membershipStatus: 'active',
          frequency,
          grindPreference: grindPref,
          nextDeliveryDate: 'Nov 14, 2026',
          isSyncedToSysteme: true,
        }
      : {
          id: `usr_${Date.now()}`,
          name: 'Connoisseur Guest',
          email: 'guest.member@obsidianbrew.com',
          role: 'member',
          membershipTier: tierName,
          membershipStatus: 'active',
          frequency,
          nextDeliveryDate: 'Nov 14, 2026',
          grindPreference: grindPref,
          roastPreference: 'Light Scandinavian (L1)',
          deliveryAddress: '780 Howard St, San Francisco, CA',
          createdAt: new Date().toISOString().split('T')[0],
          isSyncedToSysteme: true,
        };

    setCurrentUser(updatedUser);

    let logResult: SystemeSyncLog;
    if (syncToSysteme) {
      const res = await submitDirectToSysteme({
        name: updatedUser.name,
        email: updatedUser.email,
        tier: tierName,
        frequency,
        grind: grindPref,
      });
      logResult = res.log;
    } else {
      logResult = {
        id: `local_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        email: updatedUser.email,
        name: updatedUser.name,
        tier: tierName,
        status: 'simulated',
        payload: { tier: tierName, frequency },
      };
    }

    return { success: true, log: logResult };
  };

  const cancelSubscription = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      membershipStatus: 'none',
      membershipTier: null,
      frequency: null,
      nextDeliveryDate: null,
    });
  };

  const updateSystemeConfig = (config: Partial<SystemeConfig>) => {
    setSystemeConfig((prev) => ({ ...prev, ...config }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        quickLogin,
        updateUser,
        subscribeToPlan,
        cancelSubscription,
        systemeConfig,
        updateSystemeConfig,
        systemeLogs,
        submitDirectToSysteme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
