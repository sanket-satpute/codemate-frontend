import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from './chat-message.model';
import { WebSocketService } from '../../core/services/websocket.service'; // Re-using WebSocketService
import { WebSocketEvent, WebSocketEventType } from './websocket-event.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = '/api/chat';
  private incomingChatMessagesSubject = new Subject<ChatMessage>();
  public incomingChatMessages$: Observable<ChatMessage> = this.incomingChatMessagesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {}

  getChatHistory(projectId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/${projectId}/history`);
  }

  sendMessage(projectId: string, content: string): Observable<ChatMessage> {
    const messagePayload = { content };
    return this.http.post<ChatMessage>(`${this.apiUrl}/${projectId}/send`, messagePayload);
  }

  connect(projectId: string): void {
    this.webSocketService.connect(projectId);
    this.webSocketService.onMessage().subscribe(
      (event: WebSocketEvent) => {
        if (event.eventType === WebSocketEventType.CHAT_MESSAGE) {
          this.incomingChatMessagesSubject.next(event.data);
        }
      },
      (error) => console.error('WebSocket message error:', error),
      () => console.log('WebSocket message stream completed.')
    );
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }
}
