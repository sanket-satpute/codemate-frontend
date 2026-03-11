import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { ChatMessage, ChatResponseDTO } from '../../models/chat.model';
import { ApiEndpoints } from '../../constants/api-endpoints';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getChatHistory(projectId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}${ApiEndpoints.CHAT.HISTORY(projectId)}`)
      .pipe(catchError(this.handleError));
  }

  sendMessage(projectId: string, message: string): Observable<ChatResponseDTO> {
    return this.http.post<ChatResponseDTO>(
      `${this.apiUrl}${ApiEndpoints.CHAT.SEND(projectId)}`,
      { message }
    ).pipe(catchError(this.handleError));
  }

  clearChatHistory(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${ApiEndpoints.CHAT.CLEAR(projectId)}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Stream AI response tokens via SSE using fetch + ReadableStream.
   * Emits each token as it arrives from the server.
   */
  streamMessage(projectId: string, message: string): Observable<string> {
    return new Observable(observer => {
      const url = `${this.apiUrl}${ApiEndpoints.CHAT.STREAM(projectId)}`;
      const token = this.authService.getJwt();

      const abortController = new AbortController();

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message }),
        signal: abortController.signal
      }).then(async response => {
        if (!response.ok) {
          observer.error(new Error(`HTTP ${response.status}`));
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by double newlines
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const event of events) {
            for (const line of event.split('\n')) {
              if (line.startsWith('data:')) {
                let data = line.substring(5);
                // Strip JSON string quotes if present
                if (data.startsWith('"') && data.endsWith('"')) {
                  try { data = JSON.parse(data); } catch { /* use raw */ }
                }
                if (data) observer.next(data);
              }
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.trim()) {
          for (const line of buffer.split('\n')) {
            if (line.startsWith('data:')) {
              let data = line.substring(5);
              if (data.startsWith('"') && data.endsWith('"')) {
                try { data = JSON.parse(data); } catch { /* use raw */ }
              }
              if (data) observer.next(data);
            }
          }
        }

        observer.complete();
      }).catch(error => {
        if (error.name !== 'AbortError') {
          observer.error(error);
        }
      });

      return () => abortController.abort();
    });
  }
}
