import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from './chat-message.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;

  isUserMessage(): boolean {
    return this.message.sender === 'USER';
  }
}
