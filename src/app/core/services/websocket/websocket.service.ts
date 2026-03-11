import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/**
 * WebSocket service using native WebSocket (no SockJS/STOMP).
 *
 * Protocol (matches the reactive backend handler):
 *   Client → Server:  { "type": "SUBSCRIBE", "topic": "/topic/notifications" }
 *   Server → Client:  { "topic": "/topic/...", "payload": { ... } }
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messagesSubject = new Subject<{ topic: string; payload: unknown }>();
  public messages: Observable<{ topic: string; payload: unknown }>;
  private connected$ = new BehaviorSubject<boolean>(false);
  private pendingSubscriptions = new Set<string>();
  private reconnectTimer: any = null;
  private maxReconnectAttempts = 3;
  private reconnectAttempts = 0;

  constructor() {
    this.messages = this.messagesSubject.asObservable();
  }

  /**
   * Opens a native WebSocket to the backend /ws endpoint.
   * JWT is passed as a query parameter for authentication.
   */
  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = localStorage.getItem('jwt_token') ?? sessionStorage.getItem('jwt_token');
    if (!token) {
      return;
    }

    try {
      // Convert http(s)://host/ws → ws(s)://host/ws?token=JWT
      const wsUrl = environment.websocketUrl
        .replace(/^http/, 'ws') + '?token=' + encodeURIComponent(token);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.connected$.next(true);
        this.reconnectAttempts = 0;

        // Re-subscribe to any pending topics
        this.pendingSubscriptions.forEach(topic => this.sendSubscribe(topic));
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.topic && data.payload !== undefined) {
            this.messagesSubject.next({ topic: data.topic, payload: data.payload });
          }
        } catch (e) {
          console.warn('Failed to parse WebSocket message:', e);
        }
      };

      this.ws.onerror = (event) => {
        console.warn('WebSocket error:', event);
      };

      this.ws.onclose = () => {
        console.warn('WebSocket closed');
        this.connected$.next(false);
        this.reconnectAttempts++;
        if (this.reconnectAttempts < this.maxReconnectAttempts && (localStorage.getItem('jwt_token') ?? sessionStorage.getItem('jwt_token'))) {
          this.reconnectTimer = setTimeout(() => this.connect(), 5000);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.warn('WebSocket: max reconnect attempts reached, giving up.');
        }
      };
    } catch (err) {
      console.warn('Failed to establish WebSocket connection:', err);
      this.connected$.next(false);
    }
  }

  /**
   * Subscribe to a backend topic and get an Observable of messages for that topic.
   * Matches the old STOMP onTopic() API so consumers don't need to change.
   */
  onTopic(topic: string): Observable<unknown> {
    return new Observable(observer => {
      this.pendingSubscriptions.add(topic);

      // If already connected, subscribe immediately
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendSubscribe(topic);
      }

      // Listen for messages on this specific topic
      const sub = this.messagesSubject
        .pipe(filter(msg => msg.topic === topic))
        .subscribe(msg => observer.next(msg.payload));

      return () => {
        sub.unsubscribe();
        this.pendingSubscriptions.delete(topic);
        this.sendUnsubscribe(topic);
      };
    });
  }

  /**
   * Send a message to a backend destination.
   */
  sendMessage(destination: string, body: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'SEND', destination, body }));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', body);
    }
  }

  /**
   * Returns an observable for ALL incoming WebSocket messages.
   */
  onMessage(): Observable<unknown> {
    return this.messages;
  }

  /**
   * Check if the WebSocket is connected.
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Closes the WebSocket connection and cleans up.
   */
  close(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = 0;
    this.pendingSubscriptions.clear();
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        // Silently handle
      }
      this.ws = null;
      this.connected$.next(false);
    }
  }

  private sendSubscribe(topic: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'SUBSCRIBE', topic }));
    }
  }

  private sendUnsubscribe(topic: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'UNSUBSCRIBE', topic }));
    }
  }
}
