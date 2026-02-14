import { Component, EventEmitter, Output, signal, effect, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements AfterViewInit {
  @Input() sending = false;
  @Output() sendMessage = new EventEmitter<string>();

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  messageContent = signal('');

  constructor() {
    effect(() => {
      // Auto-resize textarea whenever content changes
      this.autoResizeTextarea();
    }, { allowSignalWrites: true });
  }

  ngAfterViewInit(): void {
    this.autoResizeTextarea();
  }

  onInput(): void {
    this.autoResizeTextarea();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      this.send();
    }
  }

  send(): void {
    const content = this.messageContent().trim();
    if (content && !this.sending) {
      this.sendMessage.emit(content);
      this.messageContent.set('');
      this.autoResizeTextarea(); // Reset textarea size
    }
  }

  private autoResizeTextarea(): void {
    if (this.textarea && this.textarea.nativeElement) {
      const textarea = this.textarea.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
