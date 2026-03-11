import { Component, OnInit, OnDestroy, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../core/services/chat/chat.service';
import { ChatMessage } from '../../../core/models/chat.model';
import { ProjectService } from '../../../core/services/project/project.service';
import { ToastService } from '../../../core/services/toast';
import { MarkdownToHtmlPipe } from '../../../shared/pipes/markdown-to-html.pipe';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownToHtmlPipe],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private subscriptions: Subscription[] = [];

  projectId = '';
  projectName = signal('');
  isLoading = signal(true);
  isSending = signal(false);
  chatMessages = signal<ChatMessage[]>([]);
  chatInput = '';
  private shouldScrollToBottom = false;

  suggestedPrompts = [
    { icon: 'fas fa-bug', label: 'Find bugs in my code', text: 'Can you find potential bugs or issues in my codebase?' },
    { icon: 'fas fa-lightbulb', label: 'Suggest improvements', text: 'What improvements can you suggest for my code?' },
    { icon: 'fas fa-shield-alt', label: 'Security review', text: 'Review my code for security vulnerabilities' },
    { icon: 'fas fa-sitemap', label: 'Explain architecture', text: 'Explain the architecture and structure of this project' },
  ];

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    if (!this.projectId) {
      this.toastService.showError('No project ID found.');
      this.isLoading.set(false);
      return;
    }

    this.projectService.getProjectById(this.projectId).subscribe({
      next: (p) => this.projectName.set(p.name),
      error: () => this.projectName.set('Unknown Project'),
    });

    this.loadHistory();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.chatService.getChatHistory(this.projectId).subscribe({
      next: (messages) => {
        this.chatMessages.set(messages ?? []);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to load chat history', err);
        this.chatMessages.set([]);
        this.isLoading.set(false);
      },
    });
  }

  sendMessage(): void {
    const text = this.chatInput.trim();
    if (!text || this.isSending()) return;

    this.isSending.set(true);

    // Optimistic: add user message immediately
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      projectId: this.projectId,
      sender: 'USER',
      message: text,
      timestamp: new Date().toISOString(),
    };

    // Add AI placeholder for streaming
    const aiMsg: ChatMessage = {
      id: `ai-stream-${Date.now()}`,
      projectId: this.projectId,
      sender: 'AI',
      message: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    this.chatMessages.update((msgs) => [...msgs, userMsg, aiMsg]);
    this.chatInput = '';
    this.shouldScrollToBottom = true;

    const sub = this.chatService.streamMessage(this.projectId, text).subscribe({
      next: (token) => {
        this.chatMessages.update((msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id ? { ...m, message: m.message + token } : m
          )
        );
        this.shouldScrollToBottom = true;
      },
      complete: () => {
        this.chatMessages.update((msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id ? { ...m, isStreaming: false } : m
          )
        );
        this.isSending.set(false);
      },
      error: () => {
        this.chatMessages.update((msgs) =>
          msgs.filter((m) => m.id !== userMsg.id && m.id !== aiMsg.id)
        );
        this.toastService.showError('Failed to send message.');
        this.isSending.set(false);
      },
    });
    this.subscriptions.push(sub);
  }

  clearChat(): void {
    this.chatService.clearChatHistory(this.projectId).subscribe({
      next: () => {
        this.chatMessages.set([]);
        this.toastService.showSuccess('Chat cleared.');
      },
      error: () => this.toastService.showError('Failed to clear chat.'),
    });
  }

  useSuggestedPrompt(text: string): void {
    this.chatInput = text;
    this.sendMessage();
  }

  copyMessage(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => this.toastService.showSuccess('Copied to clipboard'),
      () => this.toastService.showError('Failed to copy')
    );
  }

  trackByMessageId(_index: number, msg: ChatMessage): string {
    return msg.id;
  }

  formatTimestamp(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { /* ignore */ }
  }
}
