import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss'],
})
export class EmptyStateComponent {
  @Input() icon = '📦'; // Default icon
  @Input() title = 'No Data Available';
  @Input() message = 'There is nothing to display here yet.';
  @Input() buttonText: string | null = null;
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
