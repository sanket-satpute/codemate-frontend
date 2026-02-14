import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs'; // Import 'of'
import { catchError, filter, map } from 'rxjs/operators'; // Import 'filter' and 'map'
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { ChatMessage, SendMessageRequest } from '../../models/chat.model';
import { WebSocketService } from '../websocket/websocket.service'; // Import WebSocketService

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/chat`;
  private chatHistorySubjects = new Map<string, BehaviorSubject<ChatMessage[]>>();
  private http = inject(HttpClient);
  private wsService = inject(WebSocketService); // Inject WebSocketService

  constructor() {
    super();
    this.wsService.onMessage().pipe(
      // Ensure messages are filtered and mapped correctly for chat
      filter((msg: any): msg is { topic: string; payload: ChatMessage } => this.isChatMessagePayload(msg)),
      map((msg: { topic: string; payload: ChatMessage }) => msg.payload as ChatMessage) // Explicitly cast payload to ChatMessage
    ).subscribe(chatMessage => this.addMessageToHistory(chatMessage));
  }

  /**
   * Retrieves the chat history for a specific project and file from the API.
   * @param projectId The ID of the project.
   * @param fileId The ID of the file.
   * @returns An observable of the chat messages.
   */
  getChatHistory(projectId: string, fileId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/${projectId}/${fileId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Sends a chat message to the backend via WebSocket.
   * @param request The message to send.
   * @returns An observable of the sent chat message (or the server's acknowledgment).
   */
  sendMessage(request: SendMessageRequest): Observable<ChatMessage> {
    const destination = `/app/chat/${request.projectId}/${request.fileId}`; // Assuming fileId is part of SendMessageRequest
    const messagePayload: ChatMessage = {
      id: `temp-${Date.now()}`, // Temporary ID, backend should assign real ID
      projectId: request.projectId,
      fileId: request.fileId, // Include fileId in payload
      sender: request.sender, // Assuming sender is 'user' from frontend
      message: request.message,
      timestamp: new Date().toISOString()
    };
    this.wsService.sendMessage({ topic: destination, payload: messagePayload }); // Wrap in object with topic

    // Return an observable of the message that was sent (or a mock acknowledgment)
    // The actual message might come back via WebSocket later with a real ID
    return of(messagePayload); // Return the message sent for immediate UI update
  }

  /**
   * Adds an incoming message to the chat history.
   * @param message The chat message to add.
   */
  private addMessageToHistory(message: ChatMessage): void {
    const subject = this.chatHistorySubjects.get(message.projectId);
    if (subject) {
      const currentHistory = subject.value;
      subject.next([...currentHistory, message]);
    } else {
      // If no subject exists, create one and add the message
      this.chatHistorySubjects.set(message.projectId, new BehaviorSubject<ChatMessage[]>([message]));
    }
  }


  /**
   * Handles incoming messages from the WebSocket service.
   * @param message The incoming WebSocket message.
   */
  private handleIncomingWebSocketMessage(message: unknown): void {
    // Assuming the WebSocket message contains a ChatMessage structure
    if (this.isChatMessagePayload(message)) { // Renamed from isChatMessage
      const chatMessage: ChatMessage = message.payload;
      this.addMessageToHistory(chatMessage);
    }
  }

  public isChatMessagePayload(message: unknown): message is { type: string; payload: ChatMessage } { // Renamed from isChatMessage
    return (
      typeof message === 'object' &&
      message !== null &&
      'type' in message &&
      message.type === 'chatMessage' &&
      'payload' in message
    );
  }
}
