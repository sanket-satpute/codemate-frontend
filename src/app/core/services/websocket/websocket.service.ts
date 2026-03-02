import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Stomp, IFrame, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: any = null;
  private messagesSubject: Subject<unknown> = new Subject<unknown>();
  public messages: Observable<unknown>;
  private connected$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectTimer: any = null;

  constructor() {
    this.messages = this.messagesSubject.asObservable();
    // Don't auto-connect — wait until connect() is explicitly called
    // (e.g. after login when a JWT token is available)
  }

  /**
   * Establishes a STOMP over SockJS WebSocket connection.
   * Only connects if a JWT token is available. Safe to call multiple times.
   */
  connect(): void {
    if (this.client && this.client.connected) {
      return;
    }

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      // No token yet — skip connection. Will be called again after login.
      return;
    }

    try {
      const socket = new SockJS(environment.websocketUrl);
      this.client = Stomp.over(socket);

      // Disable debug logging in production
      this.client.debug = () => { };

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`
      };

      this.client.connect(
        headers,
        (_frame?: IFrame) => {
          console.log('WebSocket connected via STOMP');
          this.connected$.next(true);
          // Clear any pending reconnect
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }
        },
        (error: string | IFrame) => {
          console.error('STOMP connection error:', error);
          this.connected$.next(false);
          // Auto-reconnect after 5 seconds if token still exists
          this.reconnectTimer = setTimeout(() => {
            if (localStorage.getItem('jwt_token')) {
              this.connect();
            }
          }, 5000);
        }
      );
    } catch (err) {
      console.error('Failed to establish WebSocket connection:', err);
      this.connected$.next(false);
    }
  }

  /**
   * Subscribes to a STOMP topic and returns an Observable of messages.
   * Backend publishes messages to /topic/* destinations.
   */
  onTopic(topic: string): Observable<unknown> {
    return new Observable(observer => {
      const sub = this.connected$.pipe(
        filter((connected: boolean) => connected)
      ).subscribe(() => {
        if (!this.subscriptions.has(topic)) {
          const stompSub = this.client.subscribe(topic, (message: IMessage) => {
            try {
              const parsed = JSON.parse(message.body);
              this.messagesSubject.next({ topic, payload: parsed });
              observer.next(parsed);
            } catch (e) {
              console.error('Failed to parse STOMP message:', e);
            }
          });
          this.subscriptions.set(topic, stompSub);
        }
      });

      return () => {
        sub.unsubscribe();
        const stompSub = this.subscriptions.get(topic);
        if (stompSub) {
          stompSub.unsubscribe();
          this.subscriptions.delete(topic);
        }
      };
    });
  }

  /**
   * Sends a message to a STOMP destination.
   * Backend listens on /app/* destinations.
   */
  sendMessage(destination: string, body: unknown): void {
    if (this.client && this.client.connected) {
      this.client.send(destination, {}, JSON.stringify(body));
    } else {
      console.warn('STOMP client is not connected. Message not sent:', body);
    }
  }

  /**
   * Returns an observable for ALL incoming WebSocket messages.
   */
  onMessage(): Observable<unknown> {
    return this.messages;
  }

  /**
   * Checks if the STOMP client is currently connected.
   */
  isConnected(): boolean {
    return this.client && this.client.connected;
  }

  /**
   * Closes the STOMP connection and cleans up.
   */
  close(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.subscriptions.forEach((sub: StompSubscription) => sub.unsubscribe());
    this.subscriptions.clear();
    if (this.client) {
      this.client.disconnect(() => {
        console.log('WebSocket disconnected');
        this.connected$.next(false);
      });
      this.client = null;
    }
  }
}
