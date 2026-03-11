import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { Notification } from '../../models/notification.model';
import { WebSocketService } from '../websocket/websocket.service';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseService implements OnDestroy {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private wsService = inject(WebSocketService);

  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);

  private wsSub: Subscription | null = null;

  constructor() {
    super();
    // Attempt to connect WebSocket (will no-op if no token yet)
    this.wsService.connect();
    this.subscribeToRealTimeNotifications();
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  /**
   * Fetches all notifications for the current user from the backend.
   * GET /notifications
   */
  getNotifications(): Observable<Notification[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Notification[]>(
      `${this.apiUrl}${ApiEndpoints.NOTIFICATIONS.BASE}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(notifications => {
        this.notifications.set(notifications);
        this.updateUnreadCount();
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to load notifications. Please try again.');
        this.loading.set(false);
        return this.handleError(err);
      })
    );
  }

  /**
   * Marks a single notification as read on the backend.
   * POST /notifications/mark-read  { notificationId }
   */
  markAsRead(notificationId: string): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}${ApiEndpoints.NOTIFICATIONS.MARK_READ}`,
      { notificationId },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.notifications.update(notifications =>
          notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        this.updateUnreadCount();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Marks all notifications as read on the backend.
   * POST /notifications/mark-all-read
   */
  markAllAsRead(): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}${ApiEndpoints.NOTIFICATIONS.MARK_ALL_READ}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.notifications.update(notifications =>
          notifications.map(n => ({ ...n, read: true }))
        );
        this.updateUnreadCount();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a single notification on the backend.
   * DELETE /notifications/:id
   */
  deleteNotification(notificationId: string): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}${ApiEndpoints.NOTIFICATIONS.DELETE(notificationId)}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.notifications.update(notifications =>
          notifications.filter(n => n.id !== notificationId)
        );
        this.updateUnreadCount();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Clears all notifications for the current user on the backend.
   * POST /notifications/clear
   */
  clearAllNotifications(): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}${ApiEndpoints.NOTIFICATIONS.CLEAR}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.notifications.set([]);
        this.updateUnreadCount();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Subscribes to real-time notifications via STOMP WebSocket.
   * Listens on /topic/notifications for push updates from the backend.
   */
  private subscribeToRealTimeNotifications(): void {
    this.wsSub = this.wsService.onTopic('/topic/notifications').pipe(
      catchError(err => {
        console.error('WebSocket notification subscription error:', err);
        return EMPTY;
      })
    ).subscribe((message: unknown) => {
      const notification = message as Notification;
      if (notification && notification.id) {
        this.addNotification(notification);
      }
    });
  }

  private addNotification(notification: Notification): void {
    this.notifications.update(notifications => [notification, ...notifications]);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const count = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(count);
  }
}
