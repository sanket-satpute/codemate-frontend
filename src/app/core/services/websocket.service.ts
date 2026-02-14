import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../../modules/chat/chat-message.model'; // Assuming ChatMessage interface is in chat-message.model.ts
import { JobStatus } from '../../modules/project-details/project-details.models'; // Correctly import the enum
import { WebSocketEvent } from '../../modules/chat/websocket-event.model'; // Import WebSocketEvent

// Define a clear type for job status updates
export interface JobStatusUpdate {
  projectId: string;
  jobId: string;
  status: JobStatus;
}

// Minimal interface for StompClient to avoid 'any'
interface StompClient {
  over(ws: unknown): StompClient;
  connect(headers: object, connectCallback: () => void, errorCallback: (error: unknown) => void): void;
  subscribe(destination: string, callback: (message: { body: string }) => void): void;
  send(destination: string, headers: object, body: string): void;
  disconnect(callback: () => void): void;
}

declare const SockJS: unknown;
declare const Stomp: StompClient;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: StompClient | undefined; // Use StompClient type
  private messageSubject: Subject<WebSocketEvent> = new Subject<WebSocketEvent>();
  private jobStatusSubject: Subject<JobStatusUpdate> = new Subject<JobStatusUpdate>();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds

  connect(projectId: string): void {
    if (this.isConnected) {
      console.log('Already connected to WebSocket.');
      return;
    }

    console.log('Attempting to connect to WebSocket...');
    const ws = new (SockJS as any)(environment.websocketUrl); // Explicitly cast SockJS
    this.stompClient = Stomp.over(ws);

    if (this.stompClient) { // Null check for stompClient
      this.stompClient.connect({}, () => {
        console.log('WebSocket connected!');
        this.isConnected = true;
        this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection

        this.stompClient?.subscribe(`/topic/messages/${projectId}`, (rawMessage: { body: string }) => {
          const webSocketEvent: WebSocketEvent = JSON.parse(rawMessage.body);
          this.messageSubject.next(webSocketEvent);
        });

        // Add a new subscription for job status updates
        this.stompClient?.subscribe(`/topic/job-status/${projectId}`, (message: { body: string }) => {
          const statusUpdate: JobStatusUpdate = JSON.parse(message.body);
          this.jobStatusSubject.next(statusUpdate);
        });
      }, (error: unknown) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
        this.attemptReconnect(projectId);
      });
    }
  }

  disconnect(): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected.');
        this.isConnected = false;
      });
    }
  }

  sendMessage(projectId: string, chatMessage: ChatMessage): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.send(`/app/chat/${projectId}`, {}, JSON.stringify(chatMessage));
    } else {
      console.warn('WebSocket not connected. Message not sent:', chatMessage);
      // Optionally, queue messages or show an error to the user
    }
  }

  onMessage(): Observable<WebSocketEvent> {
    return this.messageSubject.asObservable();
  }

  // New method to get job status updates
  subscribeToJobStatus(projectId: string): Observable<JobStatusUpdate> {
    // Ensure connection is established before returning observable
    if (!this.isConnected) {
      this.connect(projectId);
    }
    return this.jobStatusSubject.asObservable();
  }

  private attemptReconnect(projectId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(projectId), this.reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached. Could not establish WebSocket connection.');
      // Notify user or take other action
    }
  }
}
