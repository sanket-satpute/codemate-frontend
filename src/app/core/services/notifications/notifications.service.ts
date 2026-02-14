import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import 'of' for creating observables from mock data
import { catchError, tap, filter, delay } from 'rxjs/operators'; // Import 'delay'
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { Notification } from '../../models/notification.model';
import { WebSocketService } from '../websocket/websocket.service';
import { HttpClient } from '@angular/common/http'; // Keep HttpClient for markAsRead, but it won't be used for getNotifications in this mock scenario

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;
  private http = inject(HttpClient); // Keep HttpClient
  // private wsService = inject(WebSocketService); // Comment out WebSocketService for now as it's not used with mock data

  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);

  // Mock notifications data
  private mockNotifications: Notification[] = [
    { id: '1', title: 'New Code Review Request', message: 'John Doe has requested a review for feature/login.', timestamp: new Date(), read: false },
    { id: '2', title: 'Security Alert', message: 'High-severity vulnerability detected in `auth.service.ts`.', timestamp: new Date(Date.now() - 3600000), read: false },
    { id: '3', title: 'Build Failed', message: 'The CI/CD pipeline failed for commit #abc1234.', timestamp: new Date(Date.now() - 7200000), read: true },
    { id: '4', title: 'New Suggestion', message: 'AI suggested a refactoring for `user-profile.component.ts`.', timestamp: new Date(Date.now() - 10800000), read: false },
  ];

  constructor() {
    super();
    // this.wsService.connect(); // Comment out WebSocket connection for now
    // this.wsService.messages.pipe(
    //   filter((message: any) => message && message.topic === '/ws/notifications'),
    //   tap((message: any) => {
    //     const newNotification: Notification = message.payload;
    //     this.addNotification(newNotification);
    //   }),
    //   catchError(this.handleError)
    // ).subscribe();
  }

  getNotifications(): Observable<Notification[]> {
    this.loading.set(true);
    this.error.set(null); // Clear any previous errors

    // Simulate an API call with a delay and return mock data
    return of(this.mockNotifications).pipe(
      delay(500), // Simulate network delay
      tap(notifications => {
        this.notifications.set(notifications);
        this.updateUnreadCount();
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to load mock notifications.');
        this.loading.set(false);
        return this.handleError(err);
      })
    );
  }

  markAsRead(notificationId: string): Observable<unknown> {
    // Simulate API call for marking as read
    return of({}).pipe( // Return an empty observable for simplicity
      delay(200),
      tap(() => {
        this.notifications.update(notifications =>
          notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        this.updateUnreadCount();
      }),
      catchError(this.handleError)
    );
    // If you need to hit a real backend for markAsRead, uncomment the original http call:
    // return this.http.post(`${this.apiUrl}/mark-read`, { notificationId }, { headers: this.getHeaders() })
    //   .pipe(
    //     tap(() => {
    //       this.notifications.update(notifications =>
    //         notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
    //       );
    //       this.updateUnreadCount();
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  clearAllNotifications(): Observable<unknown> {
    // Simulate API call for clearing all notifications
    return of({}).pipe( // Return an empty observable for simplicity
      delay(200),
      tap(() => {
        this.notifications.set([]); // Clear all notifications
        this.updateUnreadCount();
      }),
      catchError(this.handleError)
    );
  }

  // addNotification is not used with mock data that is loaded once, but kept for future use if WebSocket is re-enabled
  private addNotification(notification: Notification): void {
    this.notifications.update(notifications => [notification, ...notifications]);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const count = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(count);
  }
}
