import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat-message.model';
import { ChatMessageComponent } from './chat-message.component';
import { ChatInputComponent } from './chat-input.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    ChatInputComponent,
    LoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages = signal<ChatMessage[]>([]);
  loading = signal(true);
  sending = signal(false);

  private projectId!: string;
  private messagesSubscription: Subscription | undefined;
  private shouldScrollToBottom = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadChatHistory();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.chatService.disconnect();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadChatHistory(): void {
    this.loading.set(true);
    this.chatService.getChatHistory(this.projectId).subscribe({
      next: (history) => {
        this.messages.set(history);
        this.loading.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to load chat history:', err);
        this.loading.set(false);
      }
    });
  }

  connectWebSocket(): void {
    this.chatService.connect(this.projectId);
    this.messagesSubscription = this.chatService.incomingChatMessages$.subscribe(
      (message) => {
        this.messages.update(currentMessages => [...currentMessages, message]);
        this.shouldScrollToBottom = true;
      }
    );
  }

  onSendMessage(content: string): void {
    this.sending.set(true);
    this.chatService.sendMessage(this.projectId, content).subscribe({
      next: (sentMessage) => {
        // Optionally, add the sent message to the list immediately if not already handled by WebSocket
        // If the backend echoes the message via WebSocket, this might be redundant.
        // For now, assuming WebSocket will handle adding it.
        this.sending.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        this.sending.set(false);
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
