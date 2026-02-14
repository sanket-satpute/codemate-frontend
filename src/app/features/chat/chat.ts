import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighlightDirective } from '../../shared/directives/highlight.directive'; // Import the new directive

interface ChatMessage {
  content: string;
  isUser: boolean;
  isCode?: boolean;
  isList?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HighlightDirective], // Add HighlightDirective here
  templateUrl: './chat.html',
  styleUrl: './chat.scss', // Changed to .scss
})
export class Chat implements OnInit {
  @ViewChild('chatMessages') private chatMessagesRef!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  aiTyping: boolean = false;

  ngOnInit(): void {
    this.messages.push({
      content: 'Hello! How can I help you with your code today?',
      isUser: false,
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') {
      return;
    }

    this.messages.push({
      content: this.newMessage,
      isUser: true,
    });
    this.newMessage = '';
    this.scrollToBottom();

    this.aiTyping = true;
    setTimeout(() => {
      this.simulateAiResponse();
      this.aiTyping = false;
      this.scrollToBottom();
    }, 1500); // Simulate AI thinking time
  }

  simulateAiResponse(): void {
    const mockResponses: ChatMessage[] = [
      {
        content: `Sure, I can help you with that. For example, to refactor a component, you might consider:
- Breaking down large components into smaller, reusable ones.
- Using pure functions for predictable behavior.
- Abstracting common logic into services or utilities.`,
        isUser: false,
        isList: true,
      },
      {
        content: `Here's a code snippet for a simple counter in Angular:

\`\`\`typescript
import { Component, useState } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="decrement()">-</button>
    <span>{{ count }}</span>
    <button (click)="increment()"></button>
  \`,
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
\`\`\``,
        isUser: false,
        isCode: true,
      },
      {
        content: 'I noticed a potential security vulnerability in `src/app/auth/auth.service.ts` on line 42. It seems like the JWT token is being stored in local storage without proper encryption.',
        isUser: false,
      },
      {
        content: 'Could you provide more context or the specific file you are referring to?',
        isUser: false,
      },
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    this.messages.push(randomResponse);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesRef) {
        this.chatMessagesRef.nativeElement.scrollTop = this.chatMessagesRef.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
