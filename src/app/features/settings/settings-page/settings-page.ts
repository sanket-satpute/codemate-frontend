import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface Profile {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  initials: string;
}

interface Device {
  browser: string;
  os: string;
  ip: string;
  loginTime: Date;
}

interface LoginHistory {
  browser: string;
  os: string;
  ip: string;
  timestamp: Date;
}

interface DeveloperSettings {
  lineNumbers: boolean;
  minimap: boolean;
  autosave: boolean;
  tabSize: number;
}

interface Project {
  id: string;
  name: string;
}

interface NotificationCategoryPref {
  label: string;
  enabled: boolean;
}

interface DeliveryMethodPref {
  label: string;
  enabled: boolean;
}

interface PaymentMethod {
  last4: string;
  type: string;
  icon: string;
}

interface Invoice {
  id: string;
  date: Date;
  amount: number;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  permissions: string;
  lastSynced?: Date;
}

interface ApiKey {
  id: string;
  partialKey: string;
  fullKey: string;
  lastUsed: Date;
  expiryDate: Date;
}

interface Member {
  id: string;
  name: string;
  role: string;
  initials: string;
}

interface Workspace {
  members: Member[];
  projectLimit: number;
  storageUsedMB: number;
  storageLimitMB: number;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage implements OnInit {
  activeSection = 'profile';
  toastMessage = '';
  toastVisible = false;
  showDeleteModal = false;
  deleteModalTitle = '';
  deleteModalMessage = '';
  deleteModalAction: (() => void) | null = null;
  copiedKeyId = '';

  sidebarItems: SidebarItem[] = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
    { id: 'account-security', label: 'Account & Security', icon: 'fas fa-shield-alt' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card' },
    { id: 'integrations', label: 'Integrations', icon: 'fas fa-puzzle-piece' },
    { id: 'api-keys', label: 'API Keys', icon: 'fas fa-key' },
    { id: 'workspace', label: 'Workspace', icon: 'fas fa-users-cog' },
    { id: 'danger-zone', label: 'Danger Zone', icon: 'fas fa-exclamation-triangle' },
  ];

  profile: Profile = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    initials: 'JD',
  };

  twoFaEnabled = true;
  loggedInDevices: Device[] = [
    { browser: 'Chrome', os: 'Windows 11', ip: '192.168.1.1', loginTime: new Date(Date.now() - 3600000) },
    { browser: 'Firefox', os: 'macOS', ip: '10.0.0.5', loginTime: new Date(Date.now() - 86400000) },
  ];
  loginHistory: LoginHistory[] = [
    { browser: 'Chrome', os: 'Windows 11', ip: '192.168.1.1', timestamp: new Date(Date.now() - 3600000) },
    { browser: 'Firefox', os: 'macOS', ip: '10.0.0.5', timestamp: new Date(Date.now() - 86400000) },
    { browser: 'Edge', os: 'Windows 10', ip: '172.16.0.10', timestamp: new Date(Date.now() - 2 * 86400000) },
  ];

  selectedTheme = 'dark';
  devSettings: DeveloperSettings = { lineNumbers: true, minimap: false, autosave: true, tabSize: 2 };
  selectedLanguage = 'en';
  selectedRegion = 'us';
  defaultDashboardProject = 'project-1';
  availableProjects: Project[] = [
    { id: 'project-1', name: 'CodeScope AI Backend' },
    { id: 'project-2', name: 'CodeScope AI Frontend' },
    { id: 'project-3', name: 'Mobile App' },
  ];
  cardDensity = 'comfortable';

  notifCategories: NotificationCategoryPref[] = [
    { label: 'Code Analysis', enabled: true },
    { label: 'Security Alerts', enabled: true },
    { label: 'AI Recommendations', enabled: true },
    { label: 'Build/Deploy Updates', enabled: false },
    { label: 'Chat Mentions', enabled: true },
    { label: 'Billing Alerts', enabled: false },
  ];
  deliveryMethods: DeliveryMethodPref[] = [
    { label: 'In-app', enabled: true },
    { label: 'Email', enabled: false },
    { label: 'Push Notifications', enabled: true },
  ];
  selectedFrequency = 'instant';

  billing = {
    currentPlan: 'Pro Developer',
    price: 49.99,
    renewalDate: 'Dec 31, 2025',
    paymentMethods: [
      { last4: '1234', type: 'Visa', icon: 'fab fa-cc-visa' } as PaymentMethod,
      { last4: '5678', type: 'Mastercard', icon: 'fab fa-cc-mastercard' } as PaymentMethod,
    ],
    invoices: [
      { id: 'INV-2025-11', date: new Date(2025, 10, 1), amount: 49.99 } as Invoice,
      { id: 'INV-2025-10', date: new Date(2025, 9, 1), amount: 49.99 } as Invoice,
    ],
  };

  integrations: Integration[] = [
    { id: 'github', name: 'GitHub', icon: 'fab fa-github', connected: true, permissions: 'Read/Write repos', lastSynced: new Date(Date.now() - 3600000) },
    { id: 'gitlab', name: 'GitLab', icon: 'fab fa-gitlab', connected: false, permissions: 'None' },
    { id: 'bitbucket', name: 'Bitbucket', icon: 'fab fa-bitbucket', connected: false, permissions: 'None' },
    { id: 'slack', name: 'Slack', icon: 'fab fa-slack', connected: true, permissions: 'Send notifications' },
    { id: 'discord', name: 'Discord', icon: 'fab fa-discord', connected: false, permissions: 'None' },
    { id: 'jira', name: 'Jira', icon: 'fab fa-jira', connected: true, permissions: 'Create issues' },
    { id: 'vscode', name: 'VS Code', icon: 'fas fa-code', connected: true, permissions: 'Full access' },
    { id: 'webhooks', name: 'Webhooks', icon: 'fas fa-link', connected: false, permissions: 'None' },
  ];

  newApiKeyName = '';
  apiKeys: ApiKey[] = [
    { id: 'key-1', partialKey: 'cm_live_abc...xyz', fullKey: 'cm_live_demo_key_1234567890abcdef', lastUsed: new Date(Date.now() - 7200000), expiryDate: new Date(2026, 0, 1) },
    { id: 'key-2', partialKey: 'cm_test_def...uvw', fullKey: 'cm_test_demo_key_0987654321fedcba', lastUsed: new Date(Date.now() - 172800000), expiryDate: new Date(2027, 5, 15) },
  ];

  workspace: Workspace = {
    members: [
      { id: 'mem-1', name: 'John Doe', role: 'Admin', initials: 'JD' },
      { id: 'mem-2', name: 'Jane Smith', role: 'Developer', initials: 'JS' },
      { id: 'mem-3', name: 'Peter Jones', role: 'Guest', initials: 'PJ' },
    ],
    projectLimit: 10,
    storageUsedMB: 5 * 1024,
    storageLimitMB: 10 * 1024,
  };

  ngOnInit() {
    this.activeSection = 'profile';
  }

  selectSection(id: string) { this.activeSection = id; }

  showToast(msg: string) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 3000);
  }

  saveProfile() { this.showToast('Profile saved successfully'); }
  changePassword() { this.showToast('Password changed successfully'); }

  toggle2fa() {
    this.twoFaEnabled = !this.twoFaEnabled;
    this.showToast(`2FA ${this.twoFaEnabled ? 'enabled' : 'disabled'}`);
  }

  toggleIntegration(i: Integration) {
    i.connected = !i.connected;
    this.showToast(`${i.name} ${i.connected ? 'connected' : 'disconnected'}`);
  }

  createApiKey() {
    if (this.newApiKeyName.trim()) {
      const key: ApiKey = {
        id: `key-${Date.now()}`,
        partialKey: `cm_${this.newApiKeyName.substring(0, 4)}...${Math.random().toString(36).substring(2, 5)}`,
        fullKey: `cm_${this.newApiKeyName}_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        lastUsed: new Date(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      };
      this.apiKeys.push(key);
      this.newApiKeyName = '';
      this.showToast('API key created');
    }
  }

  copyApiKey(key: ApiKey) {
    navigator.clipboard.writeText(key.fullKey).then(() => {
      this.copiedKeyId = key.id;
      this.showToast('API key copied to clipboard');
      setTimeout(() => { this.copiedKeyId = ''; }, 2000);
    });
  }

  revokeApiKey(id: string) {
    this.openDeleteModal('Revoke API Key', 'This key will be permanently revoked and cannot be recovered.', () => {
      this.apiKeys = this.apiKeys.filter(k => k.id !== id);
      this.showToast('API key revoked');
    });
  }

  openDeleteModal(title: string, message: string, action: () => void) {
    this.deleteModalTitle = title;
    this.deleteModalMessage = message;
    this.deleteModalAction = action;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.deleteModalAction) this.deleteModalAction();
    this.showDeleteModal = false;
  }

  cancelDelete() { this.showDeleteModal = false; }

  deleteAccount() {
    this.openDeleteModal('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', () => {
      this.showToast('Account deletion requested');
    });
  }

  deleteWorkspace() {
    this.openDeleteModal('Delete Workspace', 'All projects and data in this workspace will be permanently lost.', () => {
      this.showToast('Workspace deletion requested');
    });
  }

  transferOwnership() {
    this.openDeleteModal('Transfer Ownership', 'Administrative control of this workspace will be transferred.', () => {
      this.showToast('Ownership transfer initiated');
    });
  }

  resetAllSettings() {
    this.openDeleteModal('Reset All Settings', 'All your settings will revert to their default values.', () => {
      this.selectedTheme = 'dark';
      this.devSettings = { lineNumbers: true, minimap: false, autosave: true, tabSize: 2 };
      this.showToast('Settings reset to defaults');
    });
  }

  formatStorage(mb: number): string {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  }

  storagePercent(): number {
    return Math.round((this.workspace.storageUsedMB / this.workspace.storageLimitMB) * 100);
  }

  getRelativeTime(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
