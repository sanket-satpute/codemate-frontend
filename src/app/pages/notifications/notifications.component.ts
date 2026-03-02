import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { Notification } from '../../core/models/notification.model';
import { Subscription } from 'rxjs';

/** View-model wrapper for template convenience */
interface NotificationView extends Notification {
  /** Alias for template: falls back to message */
  description: string;
  badges: string[];
}

interface TypeStyle {
  icon: string;
  color: string;
  label: string;
}

interface PreferenceOption {
  label: string;
  enabled: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private fetchSub: Subscription | null = null;

  isDetailOpen = false;
  isPreferencesOpen = false;
  selectedNotification: NotificationView | null = null;
  soundEnabled = true;

  categories = [
    'All', 'System', 'Code Analysis', 'Security',
    'AI Recommendations', 'Project Updates', 'Errors',
    'Chat & Collaboration', 'Billing'
  ];
  selectedCategory = 'All';

  typeStyles: { [key: string]: TypeStyle } = {
    'System': { icon: 'fas fa-bell', color: '#6366f1', label: 'System' },
    'Code Analysis': { icon: 'fas fa-flask', color: '#f59e0b', label: 'Code Analysis' },
    'Security': { icon: 'fas fa-shield-alt', color: '#ef4444', label: 'Security' },
    'AI Recommendations': { icon: 'fas fa-brain', color: '#06b6d4', label: 'AI' },
    'Project Updates': { icon: 'fas fa-code-branch', color: '#22c55e', label: 'Project' },
    'Errors': { icon: 'fas fa-times-circle', color: '#f97316', label: 'Error' },
    'Warnings': { icon: 'fas fa-exclamation-triangle', color: '#eab308', label: 'Warning' },
    'Chat & Collaboration': { icon: 'fas fa-comments', color: '#8b5cf6', label: 'Chat' },
    'Billing': { icon: 'fas fa-credit-card', color: '#ec4899', label: 'Billing' },
  };

  notifications: NotificationView[] = [];
  groupedNotifications: { date: string; notifications: NotificationView[] }[] = [];

  preferenceCategories: PreferenceOption[] = [
    { label: 'Code Analysis', enabled: true },
    { label: 'Security Alerts', enabled: true },
    { label: 'AI Recommendations', enabled: true },
    { label: 'Build/Deploy Updates', enabled: false },
    { label: 'Chat Mentions', enabled: true },
    { label: 'Billing Alerts', enabled: false },
  ];

  deliveryOptions: PreferenceOption[] = [
    { label: 'In-app', enabled: true },
    { label: 'Email', enabled: false },
    { label: 'Desktop notifications', enabled: true },
  ];

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.fetchSub?.unsubscribe();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getTypeStyle(type: string | undefined): TypeStyle {
    return this.typeStyles[type || ''] || { icon: 'fas fa-info-circle', color: '#6366f1', label: type || 'General' };
  }

  /**
   * Fetches notifications from the real backend via NotificationsService
   * and maps them to the view-model shape expected by the template.
   */
  loadNotifications() {
    this.fetchSub = this.notificationsService.getNotifications().subscribe({
      next: (raw: Notification[]) => {
        this.notifications = raw.map(n => this.toView(n));
        this.regroupNotifications();
      },
      error: () => {
        // Error is already handled inside the service (signal + console)
        this.notifications = [];
        this.regroupNotifications();
      }
    });
  }

  /** Convert the canonical Notification model to the template view-model */
  private toView(n: Notification): NotificationView {
    return {
      ...n,
      description: n.message,
      badges: n.badges ?? (n.type ? [n.type] : []),
    };
  }

  regroupNotifications() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date(today); last7Days.setDate(today.getDate() - 7);

    const grouped: { [key: string]: NotificationView[] } = {
      'Today': [], 'Yesterday': [], 'Last 7 Days': [], 'Older': [],
    };

    const filtered = this.selectedCategory === 'All'
      ? this.notifications
      : this.notifications.filter(n => n.type === this.selectedCategory);

    filtered.forEach(n => {
      const d = new Date(n.timestamp); d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime()) grouped['Today'].push(n);
      else if (d.getTime() === yesterday.getTime()) grouped['Yesterday'].push(n);
      else if (d > last7Days) grouped['Last 7 Days'].push(n);
      else grouped['Older'].push(n);
    });

    this.groupedNotifications = Object.keys(grouped)
      .filter(k => grouped[k].length > 0)
      .map(k => ({ date: k, notifications: grouped[k] }));
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.regroupNotifications();
  }

  markAllAsRead() {
    // Mark each unread notification as read via the backend
    const unread = this.notifications.filter(n => !n.read);
    unread.forEach(n => {
      this.notificationsService.markAsRead(n.id).subscribe();
    });
    this.notifications.forEach(n => n.read = true);
  }

  openDetail(notification: NotificationView) {
    this.selectedNotification = notification;
    this.isDetailOpen = true;
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id).subscribe();
      notification.read = true;
    }
  }

  closeDetail() {
    this.isDetailOpen = false;
    this.selectedNotification = null;
  }

  openPreferences() { this.isPreferencesOpen = true; }
  closePreferences() { this.isPreferencesOpen = false; }

  savePreferences() {
    console.log('Preferences saved');
    this.closePreferences();
  }

  toggleRead(n: NotificationView) {
    if (!n.read) {
      this.notificationsService.markAsRead(n.id).subscribe();
    }
    n.read = !n.read;
  }

  dismissNotification(n: NotificationView) {
    this.notifications = this.notifications.filter(x => x.id !== n.id);
    this.regroupNotifications();
    if (this.selectedNotification?.id === n.id) this.closeDetail();
  }

  // Contextual: only for code/security types
  isAnalysisType(n: NotificationView): boolean {
    return ['Code Analysis', 'Security', 'AI Recommendations'].includes(n.type || '');
  }

  viewReport(n: NotificationView) { console.log('View report:', n.id); }
  rerunScan(n: NotificationView) { console.log('Re-run scan:', n.relatedProject); }
  fixWithAI(n: NotificationView) { console.log('Fix with AI:', n.id); }
  openProject(n: NotificationView) { console.log('Open project:', n.relatedProject); }

  getRelativeTime(date: Date | string): string {
    const now = Date.now();
    const d = date instanceof Date ? date : new Date(date);
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
