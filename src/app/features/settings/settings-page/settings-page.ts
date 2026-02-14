import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Define Interfaces for data structures
interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface Profile {
  photoUrl: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
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

interface ThemeOption {
  label: string;
  value: string;
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

interface NotificationCategoryPreference {
  label: string;
  enabled: boolean;
}

interface DeliveryMethodPreference {
  label: string;
  enabled: boolean;
}

interface FrequencyOption {
  label: string;
  value: string;
}

interface NotificationPreferences {
  categories: NotificationCategoryPreference[];
  deliveryMethods: DeliveryMethodPreference[];
  frequencies: FrequencyOption[];
  selectedFrequency: string;
}

interface PaymentMethod {
  last4: string;
  type: string;
}

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  pdfUrl: string;
}

interface Billing {
  currentPlan: string;
  renewalCycle: string;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
}

interface Integration {
  id: string;
  name: string;
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
}

interface Workspace {
  members: Member[];
  projectLimit: number;
  storageUsed: number; // Changed from string to number (e.g., in MB)
  storageLimit: number; // Changed from string to number (e.g., in MB)
}


@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
  providers: [DatePipe, CurrencyPipe]
})
export class SettingsPage implements OnInit {
  activeSection: string = 'profile';

  sidebarItems: SidebarItem[] = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
    { id: 'account-security', label: 'Account & Security', icon: 'fas fa-shield-alt' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card' },
    { id: 'integrations', label: 'Integrations', icon: 'fas fa-puzzle-piece' },
    { id: 'api-keys', label: 'API Keys', icon: 'fas fa-key' },
    { id: 'workspace-settings', label: 'Workspace Settings', icon: 'fas fa-users-cog' },
    { id: 'danger-zone', label: 'Danger Zone', icon: 'fas fa-exclamation-triangle' },
  ];

  // Mock Data
  profile: Profile = {
    photoUrl: 'https://via.placeholder.com/150',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
  };

  twoFaEnabled: boolean = true;
  loggedInDevices: Device[] = [
    { browser: 'Chrome', os: 'Windows 11', ip: '192.168.1.1', loginTime: new Date(Date.now() - 3600000) },
    { browser: 'Firefox', os: 'macOS', ip: '10.0.0.5', loginTime: new Date(Date.now() - 86400000) },
  ];
  loginHistory: LoginHistory[] = [
    { browser: 'Chrome', os: 'Windows 11', ip: '192.168.1.1', timestamp: new Date(Date.now() - 3600000) },
    { browser: 'Firefox', os: 'macOS', ip: '10.0.0.5', timestamp: new Date(Date.now() - 86400000) },
    { browser: 'Edge', os: 'Windows 10', ip: '172.16.0.10', timestamp: new Date(Date.now() - 2 * 86400000) },
  ];

  themes: ThemeOption[] = [
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' },
    { label: 'System', value: 'system' },
  ];
  selectedTheme: string = 'dark';
  devSettings: DeveloperSettings = {
    lineNumbers: true,
    minimap: false,
    autosave: true,
    tabSize: 2,
  };
  selectedLanguage: string = 'en';
  selectedRegion: string = 'us';
  defaultDashboardProject: string = 'project-1';
  availableProjects: Project[] = [
    { id: 'project-1', name: 'CodeScope AI Backend' },
    { id: 'project-2', name: 'CodeScope AI Frontend' },
    { id: 'project-3', name: 'Mobile App' },
  ];
  cardDensity: string = 'comfortable';

  notificationPreferences: NotificationPreferences = {
    categories: [
      { label: 'Code Analysis', enabled: true },
      { label: 'Security Alerts', enabled: true },
      { label: 'AI Recommendations', enabled: true },
      { label: 'Build/Deploy Updates', enabled: false },
      { label: 'Chat Mentions', enabled: true },
      { label: 'Billing Alerts', enabled: false },
    ],
    deliveryMethods: [
      { label: 'In-app', enabled: true },
      { label: 'Email', enabled: false },
      { label: 'Push', enabled: true },
    ],
    frequencies: [
      { label: 'Instant', value: 'instant' },
      { label: 'Daily summary', value: 'daily' },
      { label: 'Weekly summary', value: 'weekly' },
    ],
    selectedFrequency: 'instant',
  };

  billing: Billing = {
    currentPlan: 'Pro Developer',
    renewalCycle: 'monthly (next on 2025-12-31)',
    paymentMethods: [
      { last4: '1234', type: 'Visa' },
      { last4: '5678', type: 'Mastercard' },
    ],
    invoices: [
      { id: '2025-11-01', date: new Date(2025, 10, 1), amount: 49.99, pdfUrl: '#' },
      { id: '2025-10-01', date: new Date(2025, 9, 1), amount: 49.99, pdfUrl: '#' },
    ],
  };

  integrations: Integration[] = [
    { id: 'github', name: 'GitHub', connected: true, permissions: 'Read/Write repos', lastSynced: new Date(Date.now() - 3600000) },
    { id: 'gitlab', name: 'GitLab', connected: false, permissions: 'None' },
    { id: 'bitbucket', name: 'Bitbucket', connected: false, permissions: 'None' },
    { id: 'slack', name: 'Slack', connected: true, permissions: 'Send notifications' },
    { id: 'discord', name: 'Discord', connected: false, permissions: 'None' },
    { id: 'jira', name: 'Jira', connected: true, permissions: 'Create issues' },
    { id: 'vscode', name: 'VS Code Extension', connected: true, permissions: 'Full access' },
    { id: 'webhooks', name: 'Webhooks', connected: false, permissions: 'None' },
  ];

  newApiKeyName: string = '';
  apiKeys: ApiKey[] = [
    { id: 'key-1', partialKey: 'cm_live_abc...xyz', fullKey: 'cm_live_demo_key_1234567890abcdef', lastUsed: new Date(Date.now() - 7200000), expiryDate: new Date(2026, 0, 1) },
    { id: 'key-2', partialKey: 'cm_test_def...uvw', fullKey: 'cm_test_demo_key_0987654321fedcba', lastUsed: new Date(Date.now() - 172800000), expiryDate: new Date(2027, 5, 15) },
  ];

  workspace: Workspace = {
    members: [
      { id: 'mem-1', name: 'John Doe', role: 'Admin' },
      { id: 'mem-2', name: 'Jane Smith', role: 'Developer' },
      { id: 'mem-3', name: 'Peter Jones', role: 'Guest' },
    ],
    projectLimit: 10,
    storageUsed: 5 * 1024, // 5GB in MB
    storageLimit: 10 * 1024, // 10GB in MB
  };

  ngOnInit() {
    // Initialize active section based on route or default
    this.activeSection = this.sidebarItems[0].id; // Default to 'profile'
  }

  selectSidebarItem(itemId: string) {
    this.activeSection = itemId;
    // Potentially navigate using router if not already handled by routerLink
  }

  toggle2fa() {
    this.twoFaEnabled = !this.twoFaEnabled;
    console.log('2FA Toggled:', this.twoFaEnabled);
  }

  toggleIntegration(integration: Integration) {
    integration.connected = !integration.connected;
    console.log('Integration Toggled:', integration.name, integration.connected);
  }

  createApiKey() {
    if (this.newApiKeyName) {
      const newKey: ApiKey = {
        id: `key-${this.apiKeys.length + 1}`,
        partialKey: `sk_new_${this.newApiKeyName.substring(0, 3)}...${Math.random().toString(36).substring(2, 5)}`,
        fullKey: `sk_new_full_${this.newApiKeyName}_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        lastUsed: new Date(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires in 1 year
      };
      this.apiKeys.push(newKey);
      this.newApiKeyName = '';
      console.log('New API Key created:', newKey);
    }
  }

  copyApiKey(fullKey: string) {
    navigator.clipboard.writeText(fullKey).then(() => {
      alert('API Key copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy API Key:', err);
    });
  }

  revokeApiKey(keyId: string) {
    if (confirm('Are you sure you want to revoke this API Key? This action cannot be undone.')) {
      this.apiKeys = this.apiKeys.filter(key => key.id !== keyId);
      console.log('API Key revoked:', keyId);
    }
  }

  confirmDeleteAccount() {
    if (confirm('WARNING: Permanently delete your account? This action is irreversible.')) {
      console.log('Account deletion confirmed.');
      // Implement actual account deletion logic
    }
  }

  confirmDeleteWorkspace() {
    if (confirm('WARNING: Permanently delete this workspace? All projects and data will be lost. This action is irreversible.')) {
      console.log('Workspace deletion confirmed.');
      // Implement actual workspace deletion logic
    }
  }

  confirmTransferOwnership() {
    if (confirm('WARNING: Transfer ownership of this workspace? This changes administrative control.')) {
      console.log('Ownership transfer confirmed.');
      // Implement actual ownership transfer logic
    }
  }

  confirmResetSettings() {
    if (confirm('Are you sure you want to reset all your settings to default?')) {
      console.log('Settings reset confirmed.');
      // Implement actual settings reset logic
      this.resetSettingsToDefault();
    }
  }

  private resetSettingsToDefault() {
    // Reset all settings to their initial mock values
    this.selectedTheme = 'dark';
    this.devSettings = {
      lineNumbers: true,
      minimap: false,
      autosave: true,
      tabSize: 2,
    };
    this.selectedLanguage = 'en';
    this.selectedRegion = 'us';
    this.defaultDashboardProject = 'project-1';
    this.cardDensity = 'comfortable';

    this.notificationPreferences = {
      categories: [
        { label: 'Code Analysis', enabled: true },
        { label: 'Security Alerts', enabled: true },
        { label: 'AI Recommendations', enabled: true },
        { label: 'Build/Deploy Updates', enabled: false },
        { label: 'Chat Mentions', enabled: true },
        { label: 'Billing Alerts', enabled: false },
      ],
      deliveryMethods: [
        { label: 'In-app', enabled: true },
        { label: 'Email', enabled: false },
        { label: 'Push', enabled: true },
      ],
      frequencies: [
        { label: 'Instant', value: 'instant' },
        { label: 'Daily summary', value: 'daily' },
        { label: 'Weekly summary', value: 'weekly' },
      ],
      selectedFrequency: 'instant',
    };
    // ... reset other data as needed
  }
}
