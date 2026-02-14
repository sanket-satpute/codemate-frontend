import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state'; // Import EmptyStateComponent

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface ApiChatMessage {
  sender: 'user' | 'ai';
  message: string;
  timestamp: string | number | Date;
}

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, EmptyStateComponent], // Add EmptyStateComponent
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
  providers: [DatePipe]
})
export class ChatBoxComponent implements OnInit, AfterViewChecked {
  @Input() projectId!: string;
  messages: ChatMessage[] = [];
  input = '';
  loading = false;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private datePipe = inject(DatePipe);

  ngOnInit(): void {
    this.fetchChatHistory();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  async fetchChatHistory(): Promise<void> {
    try {
      const res = await axios.get<ApiChatMessage[]>(`/api/chat/${this.projectId}`);
      this.messages = res.data.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.input.trim() || this.loading) {
      return;
    }

    this.loading = true;
    const userMsg: ChatMessage = {
      sender: 'user',
      message: this.input,
      timestamp: new Date()
    };
    this.messages.push(userMsg);
    this.input = '';

    try {
      const res = await axios.post(`/api/chat/${this.projectId}`, { message: userMsg.message });
      const aiMsg: ChatMessage = {
        sender: 'ai',
        message: res.data.messageContent, // Assuming backend returns messageContent
        timestamp: new Date(res.data.timestamp) // Assuming backend returns timestamp
      };
      this.messages.push(aiMsg);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: ChatMessage = {
        sender: 'ai',
        message: 'Sorry, I could not process your request.',
        timestamp: new Date()
      };
      this.messages.push(errorMsg);
    } finally {
      this.loading = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch {
      // Ignore errors
    }
  }
}
