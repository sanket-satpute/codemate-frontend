import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Suggestion } from './suggestions.model';

@Component({
  selector: 'app-suggestion-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestion-card.component.html',
  styleUrls: ['./suggestion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestionCardComponent {
  @Input() suggestion!: Suggestion;
  @Output() previewRequested = new EventEmitter<Suggestion>();

  onPreviewClick(): void {
    this.previewRequested.emit(this.suggestion);
  }
}
