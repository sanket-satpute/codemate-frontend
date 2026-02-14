import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { filter, map } from 'rxjs/operators'; // Import filter and map
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messagesSubject: Subject<unknown> = new Subject<unknown>();
  public messages: Observable<unknown>;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL_MS = 3000; // Base reconnect interval

  constructor() {
    this.messages = this.messagesSubject.asObservable();
    this.connect();
  }

  /**
   * Establishes a WebSocket connection.
   */
  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return; // Already connected or connecting
    }

    const token = localStorage.getItem('jwt_token'); // Retrieve JWT token from localStorage to match AuthService
    const wsUrlWithToken = token ? `${environment.websocketUrl}?token=${token}` : environment.websocketUrl;

    this.socket = new WebSocket(wsUrlWithToken);

    this.socket.onopen = (event) => {
      console.log('WebSocket connected:', event);
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messagesSubject.next(message);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      if (event.wasClean) {
        console.log('WebSocket connection closed cleanly.');
      } else {
        console.error('WebSocket connection died unexpectedly.');
        this.handleReconnect();
      }
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      this.socket.close(); // Close to trigger onclose and reconnect logic
    };
  }

  /**
   * Handles reconnection logic with exponential backoff.
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.pow(2, this.reconnectAttempts) * this.RECONNECT_INTERVAL_MS;
      console.log(`Attempting to reconnect in ${delay / 1000} seconds... (Attempt ${this.reconnectAttempts + 1})`);
      timer(delay).subscribe(() => {
        this.reconnectAttempts++;
        this.connect();
      });
    } else {
      console.error('Maximum reconnect attempts reached. Please refresh the page.');
      // Optionally, emit an error or a special message to the UI
      this.messagesSubject.error('WebSocket connection lost permanently.');
    }
  }

  /**
   * Sends a message over the WebSocket.
   * @param message The message to send.
   */
  sendMessage(message: unknown): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Message not sent:', message);
      // Optionally, queue messages or inform the user
    }
  }

  /**
   * Returns an observable for incoming WebSocket messages.
   * @returns An observable of incoming messages.
   */
  onMessage(): Observable<unknown> {
    return this.messages;
  }

  /**
   * Checks if the WebSocket connection is currently open.
   */
  isConnected(): boolean {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Returns an Observable for messages received on a specific topic.
   * Assumes messages from the backend will have a 'topic' property.
   * @param topic The WebSocket topic to subscribe to (e.g., '/topic/job/{jobId}').
   * @returns An Observable of messages for the specified topic.
   */
  onTopic(topic: string): Observable<any> {
    return this.messages.pipe(
      filter((message: any): message is { topic: string; payload: any } => // Explicitly type message
        typeof message === 'object' &&
        message !== null &&
        'topic' in message &&
        message.topic === topic
      ),
      map((message: any) => message.payload) // Explicitly type message
    );
  }

  /**
   * Closes the WebSocket connection.
   */
  close(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close(1000, 'Client initiated disconnect');
    }
  }
}
