import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  fullDescription?: string;
  timestamp: Date;
  read: boolean;
  statusBadges: string[];
  relatedProject?: string;
  relatedAnalysisType?: string;
}

interface Category {
  label: string;
  value: string;
}

interface PreferenceOption {
  label: string;
  enabled: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  newNotificationsAvailable = false;
  isDetailDrawerOpen = false;
  isPreferencesDrawerOpen = false;
  selectedNotification: Notification | null = null;
  soundEnabled = true;

  categories: Category[] = [
    { label: 'All', value: 'All' },
    { label: 'System Alerts', value: 'System' },
    { label: 'Code Analysis', value: 'Code Analysis' },
    { label: 'Security', value: 'Security' },
    { label: 'AI Recommendations', value: 'AI Recommendations' },
    { label: 'Project Updates', value: 'Project Updates' },
    { label: 'Errors', value: 'Errors' },
    { label: 'Warnings', value: 'Warnings' },
    { label: 'Chat & Collaboration', value: 'Chat & Collaboration' },
    { label: 'Billing', value: 'Billing' },
  ];
  selectedCategory: string = 'All';

  notifications: Notification[] = []; // This will be populated with actual data
  groupedNotifications: { date: string; notifications: Notification[] }[] = [];

  notificationCategories: PreferenceOption[] = [
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
    { label: 'Other', enabled: false },
  ];

  ngOnInit() {
    this.loadNotifications();
    this.groupNotifications();
    // Simulate new notifications arriving
    setTimeout(() => {
      this.newNotificationsAvailable = true;
    }, 5000);
  }

  loadNotifications() {
    // Mock data for demonstration
    this.notifications = [
      {
        id: '1',
        type: 'System',
        title: 'System Update Completed',
        description: 'Your CodeScope AI platform has been updated to the latest version.',
        fullDescription: 'The platform has been successfully updated to version 2.1. All new features are now available. Please review the release notes for more details.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        statusBadges: ['New', 'System'],
      },
      {
        id: '2',
        type: 'Code Analysis',
        title: 'High Priority: Critical Security Vulnerability Found',
        description: 'A critical security vulnerability (SQL Injection) was detected in project "Backend API".',
        fullDescription: 'Detailed report available. Immediate action recommended to prevent data breaches. The vulnerability was found in `src/main/java/com/codescope/api/UserRepository.java` line 123.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: false,
        statusBadges: ['High Priority', 'Security', 'New'],
        relatedProject: 'Backend API',
        relatedAnalysisType: 'Security Scan'
      },
      {
        id: '3',
        type: 'AI Recommendations',
        title: 'AI Suggestion: Performance Improvement for Frontend',
        description: 'AI detected a potential performance bottleneck in "Frontend Dashboard" and suggested an optimization.',
        fullDescription: 'The AI recommends refactoring the data loading mechanism in `src/app/dashboard/dashboard.component.ts` to use a more efficient caching strategy, potentially reducing load times by 15%.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        statusBadges: ['AI Generated', 'Performance'],
        relatedProject: 'Frontend Dashboard',
        relatedAnalysisType: 'AI Performance Analysis'
      },
      {
        id: '4',
        type: 'Project Updates',
        title: 'New Feature Branch Merged to Main',
        description: 'Feature "User Authentication" has been merged into the main branch of "User Management Service".',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: false,
        statusBadges: ['Project Update'],
        relatedProject: 'User Management Service'
      },
      {
        id: '5',
        type: 'Errors',
        title: 'Build Failed for "Payment Gateway"',
        description: 'The latest CI/CD pipeline run for "Payment Gateway" failed due to dependency resolution issues.',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        read: true,
        statusBadges: ['Error', 'Build'],
        relatedProject: 'Payment Gateway'
      },
      {
        id: '6',
        type: 'Chat & Collaboration',
        title: 'You were mentioned in a comment on "Issue #123"',
        description: '@JohnDoe mentioned you in a discussion regarding "Bug fix for login flow".',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        read: false,
        statusBadges: ['New', 'Collaboration'],
        relatedProject: 'Frontend App'
      },
      {
        id: '7',
        type: 'Security',
        title: 'Minor Security Flaw in "Reporting Service"',
        description: 'A minor XSS vulnerability was found in the "Reporting Service" UI.',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        read: true,
        statusBadges: ['Security', 'Low Priority'],
        relatedProject: 'Reporting Service'
      },
      {
        id: '8',
        type: 'Code Analysis',
        title: 'Code Smell Detected in "Auth Microservice"',
        description: 'Duplicated code detected in multiple files within the "Auth Microservice".',
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        read: true,
        statusBadges: ['Code Quality'],
        relatedProject: 'Auth Microservice'
      },
    ];
  }

  groupNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    const grouped: { [key: string]: Notification[] } = {
      'Today': [],
      'Yesterday': [],
      'Last 7 days': [],
      'Older': [],
    };

    const filteredNotifications = this.selectedCategory === 'All'
      ? this.notifications
      : this.notifications.filter(n => n.type === this.selectedCategory);

    filteredNotifications.forEach(notification => {
      const notificationDate = new Date(notification.timestamp);
      notificationDate.setHours(0, 0, 0, 0);

      if (notificationDate.getTime() === today.getTime()) {
        grouped['Today'].push(notification);
      } else if (notificationDate.getTime() === yesterday.getTime()) {
        grouped['Yesterday'].push(notification);
      } else if (notificationDate > last7Days) {
        grouped['Last 7 days'].push(notification);
      } else {
        grouped['Older'].push(notification);
      }
    });

    this.groupedNotifications = Object.keys(grouped)
      .filter(key => grouped[key].length > 0)
      .map(key => ({ date: key, notifications: grouped[key] }));
  }

  refreshNotifications() {
    this.newNotificationsAvailable = false;
    this.loadNotifications();
    this.groupNotifications();
    // In a real app, this would fetch new data from a service
  }

  markAllAsRead() {
    this.notifications.forEach(n => (n.read = true));
  }

  openPreferencesDrawer() {
    this.isPreferencesDrawerOpen = true;
  }

  closePreferencesDrawer() {
    this.isPreferencesDrawerOpen = false;
  }

  savePreferences() {
    // Logic to save preferences (e.g., to a service or local storage)
    console.log('Preferences saved:', {
      notificationCategories: this.notificationCategories,
      deliveryOptions: this.deliveryOptions,
      soundEnabled: this.soundEnabled,
    });
    this.closePreferencesDrawer();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.groupNotifications();
  }

  openNotificationDetail(notification: Notification) {
    this.selectedNotification = notification;
    this.isDetailDrawerOpen = true;
    notification.read = true; // Mark as read when opened
  }

  closeDetailDrawer() {
    this.isDetailDrawerOpen = false;
    this.selectedNotification = null;
  }

  toggleReadStatus(notification: Notification) {
    notification.read = !notification.read;
  }

  openProject(notification: Notification) {
    console.log('Opening project for:', notification.relatedProject);
    // Implement navigation to project
  }

  viewReport(notification: Notification) {
    console.log('Viewing report for:', notification.id);
    // Implement navigation to report
  }

  dismissNotification(notification: Notification) {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    this.groupNotifications();
    console.log('Dismissed notification:', notification.id);
  }

  rerunScan(notification: Notification) {
    console.log('Re-running scan for:', notification.relatedProject, notification.relatedAnalysisType);
    // Implement re-run scan logic
  }

  fixWithAI(notification: Notification) {
    console.log('Fixing with AI for:', notification.id);
    // Implement AI fix logic
  }

  ignoreIssue(notification: Notification) {
    console.log('Ignoring issue for:', notification.id);
    // Implement ignore issue logic
  }
}
