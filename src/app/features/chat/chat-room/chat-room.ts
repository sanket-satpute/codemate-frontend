import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Import Location
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ChatService } from '../../../core/services/chat/chat.service';
import { getSystemTheme } from '../../../core/utils/theme.utils';
import { WebSocketService } from '../../../core/services/websocket/websocket.service';
import { ChatMessage } from '../../../core/models/chat.model';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-room.html',
  styleUrls: ['./chat-room.scss'], // Will rename .css to .scss
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('typingAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('200ms ease-out'))
    ])
  ]
})
export class ChatRoomComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;

  projectId: string | null = null;
  fileId: string | null = null; // Added fileId
  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  aiResponseBuffer = '';
  private chatSubscription: Subscription = new Subscription();
  private typingInterval: any;
  theme: 'light' | 'dark' = 'dark'; // Default to dark theme
  private destroy$ = new Subject<void>();

  private chatService = inject(ChatService);
  private wsService = inject(WebSocketService);
  private route = inject(ActivatedRoute);
  private elementRef = inject(ElementRef);
  private location = inject(Location);

  // Removed redundant empty constructor

  /**
   * Navigates back to the previous page.
   */
  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.detectSystemTheme();
    this.route.paramMap.pipe(
      switchMap(params => {
        this.projectId = params.get('projectId');
        this.fileId = params.get('fileId'); // Get fileId from route
        if (this.projectId && this.fileId) {
          // Fetch history and then listen for WebSocket messages
          return this.chatService.getChatHistory(this.projectId, this.fileId).pipe( // Pass fileId
            tap(history => {
              this.messages = history;
              this.scrollToBottom();
            })
          );
        }
        return of([]);
      })
    ).pipe(takeUntil(this.destroy$)).subscribe(() => {
      // After history is loaded, subscribe to WebSocket messages
      if (this.projectId) {
        // The WebSocketService's onMessage is already filtering by topic in ChatService
        // No direct subscription to wsService.onMessage() needed here if ChatService is handling it
        // and pushing updates to a BehaviorSubject or similar that this component subscribes to.
        // For now, assuming ChatService handles this internally and `messages` will be updated.
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.stopTypingEffect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:matchMedia', ['$event'])
  onThemeChange(event: Event): void {
    const mediaQueryEvent = event as MediaQueryListEvent;
    if (mediaQueryEvent.media.includes('prefers-color-scheme')) {
      this.detectSystemTheme();
    }
  }

  /**
   * Detects the user's system theme preference.
   */
  detectSystemTheme(): void {
    this.theme = getSystemTheme();
    this.applyTheme();
  }

  /**
   * Applies the current theme to the host element.
   */
  applyTheme(): void {
    const hostElement = this.elementRef.nativeElement;
    if (this.theme === 'dark') {
      hostElement.classList.add('dark-theme');
      hostElement.classList.remove('light-theme');
    } else {
      hostElement.classList.add('light-theme');
      hostElement.classList.remove('dark-theme');
    }
  }

  /**
   * Toggles between light and dark themes.
   */
  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
  }

  /**
   * Sends the current message to the chat service.
   */
  sendMessage(): void {
    if (!this.currentMessage.trim() || !this.projectId || !this.fileId) {
      return;
    }

    const request = {
      projectId: this.projectId,
      fileId: this.fileId,
      sender: 'user' as 'user' | 'ai',
      message: this.currentMessage,
    };

    // Add user message to UI immediately for optimistic update
    const userMessageForUI: ChatMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      projectId: this.projectId,
      fileId: this.fileId,
      sender: 'user',
      message: this.currentMessage,
      timestamp: new Date().toISOString() // Use ISO string
    };
    this.messages.push(userMessageForUI);
    this.scrollToBottom();

    // Send via ChatService
    this.chatService.sendMessage(request).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
            // Backend might send back the actual message via WebSocket,
            // so we rely on ChatService's subscription to update `messages`.
            // The `response` from sendMessage is just an optimistic acknowledgment for now.
            console.log('Message sent successfully (optimistic update):', response);
        },
        error: (err) => {
            console.error('Error sending message:', err);
            // Optionally, remove the optimistic message or show an error toast
            this.messages = this.messages.filter(m => m.id !== userMessageForUI.id);
            // Re-add actual message from history fetched after error or rely on UI reload
        }
    });

    this.currentMessage = ''; // Clear input
    this.isTyping = true; // Show typing indicator (AI might be generating response)
    this.aiResponseBuffer = '';
  }

  /**
   * Handles incoming WebSocket messages.
   * Note: The component itself should not directly subscribe to wsService.onMessage
   * if ChatService is already handling it and updating a centralized state.
   * If this method is still needed for handling direct raw WS messages not processed by ChatService,
   * its logic might need re-evaluation based on the actual WS message structure.
   */
  private handleIncomingWebSocketMessage(message: unknown): void {
    // This method might be redundant if ChatService handles all incoming WS messages
    // and updates a shared observable/signal that this component subscribes to.
    // For now, assuming it processes general WS messages that might not be ChatMessagePayload
    // or provides a fallback if ChatService's filter misses something.

    if (this.chatService.isChatMessagePayload(message)) { // Use the renamed type guard
      const incomingChatMessage = message.payload; // Extract the actual ChatMessage
      const existingMessageIndex = this.messages.findIndex(m => m.id === incomingChatMessage.id);
      if (existingMessageIndex > -1) {
        // Update existing message (e.g., for streaming AI response)
        this.messages[existingMessageIndex].message = incomingChatMessage.message;
        this.messages[existingMessageIndex].timestamp = incomingChatMessage.timestamp; // Update timestamp
      } else {
        // Add new message
        this.messages.push(incomingChatMessage); // Push the actual ChatMessage
      }
      this.scrollToBottom();

      // Handle typing indicator for AI messages
      if (incomingChatMessage.sender === 'ai') {
        this.isTyping = false; // Stop typing when a message is received
      }
    }
  }

  /**
   * Simulates a token-by-token typing effect for AI responses.
   * @param fullText The full text of the AI response.
   */
  private startTypingEffect(fullText: string): void {
    this.stopTypingEffect(); // Clear any existing interval
    let i = 0;
    this.typingInterval = setInterval(() => {
      if (i < fullText.length) {
        this.aiResponseBuffer += fullText.charAt(i);
        i++;
        this.scrollToBottom(); // Scroll as text appears
      } else {
        this.stopTypingEffect();
        this.isTyping = false;
        // Once typing is complete, the full message should be added to chat history
        // This part would typically be handled by the ChatService receiving the full message
        // For simulation, we might manually add it or rely on the ChatService's existing mechanism.
        // For now, we assume ChatService will eventually push the full message.
      }
    }, 50); // Adjust typing speed here
  }

  /**
   * Stops the typing effect.
   */
  private stopTypingEffect(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
  }

  /**
   * Scrolls the chat messages container to the bottom.
   */
  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    } catch (err: unknown) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
