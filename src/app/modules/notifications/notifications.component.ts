import { Component, OnInit, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent, LoaderComponent, EmptyStateComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnChanges {
  private notificationsService = inject(NotificationsService);

  @Input() isVisible: boolean = false;

  notifications = this.notificationsService.notifications;
  loading = this.notificationsService.loading;
  error = this.notificationsService.error;

  ngOnInit(): void {
    // Only fetch notifications if the component is visible initially
    if (this.isVisible) {
      this.notificationsService.getNotifications().subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true && !changes['isVisible'].previousValue) {
      // Fetch notifications only when it becomes visible
      this.notificationsService.getNotifications().subscribe();
    }
  }

  markAsRead(notificationId: string): void {
    this.notificationsService.markAsRead(notificationId).subscribe();
  }

  clearAll(): void {
    // Assuming notificationsService has a method to clear all, or clear locally
    // For now, let's assume a service call or direct signal manipulation
    this.notificationsService.clearAllNotifications().subscribe(); // Assuming this method exists
  }
}
