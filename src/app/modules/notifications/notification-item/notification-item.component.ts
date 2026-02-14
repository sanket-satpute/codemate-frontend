import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../core/models/notification.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Output() markAsRead = new EventEmitter<string>();

  onMarkAsRead(): void {
    this.markAsRead.emit(this.notification.id);
  }
}
