import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { ToastService } from '../../core/services/toast';
import { Notification } from '../../core/models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fetchSub: Subscription | null = null;

  isDetailOpen = false;
  selectedNotification: Notification | null = null;

  notifications: Notification[] = [];
  groupedNotifications: { date: string; notifications: Notification[] }[] = [];

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.fetchSub?.unsubscribe();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  loadNotifications() {
    this.fetchSub = this.notificationsService.getNotifications().subscribe({
      next: (raw: Notification[]) => {
        this.notifications = raw;
        this.regroupNotifications();
      },
      error: () => {
        this.notifications = [];
        this.regroupNotifications();
      }
    });
  }

  regroupNotifications() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date(today); last7Days.setDate(today.getDate() - 7);

    const grouped: { [key: string]: Notification[] } = {
      'Today': [], 'Yesterday': [], 'Last 7 Days': [], 'Older': [],
    };

    this.notifications.forEach(n => {
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

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.toastService.showSuccess('All notifications marked as read');
      }
    });
  }

  clearAll() {
    this.notificationsService.clearAllNotifications().subscribe({
      next: () => {
        this.notifications = [];
        this.regroupNotifications();
        this.toastService.showSuccess('All notifications cleared');
      }
    });
  }

  openDetail(notification: Notification) {
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

  toggleRead(n: Notification) {
    if (!n.read) {
      this.notificationsService.markAsRead(n.id).subscribe();
    }
    n.read = !n.read;
  }

  dismissNotification(n: Notification) {
    this.notificationsService.deleteNotification(n.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(x => x.id !== n.id);
        this.regroupNotifications();
        if (this.selectedNotification?.id === n.id) this.closeDetail();
      }
    });
  }

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
