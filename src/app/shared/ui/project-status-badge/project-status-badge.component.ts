import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="statusClass">{{ statusText }}</span>
  `,
  styleUrls: ['./project-status-badge.component.scss']
})
export class ProjectStatusBadgeComponent {
  @Input() status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'IN_PROGRESS' = 'PENDING';

  get statusClass(): string {
    switch (this.status) {
      case 'PENDING':
        return 'badge status-pending';
      case 'RUNNING':
      case 'IN_PROGRESS':
        return 'badge status-running';
      case 'COMPLETED':
        return 'badge status-completed';
      case 'FAILED':
        return 'badge status-failed';
      default:
        return 'badge';
    }
  }

  get statusText(): string {
    switch (this.status) {
      case 'PENDING':
        return 'Not Started';
      case 'RUNNING':
      case 'IN_PROGRESS':
        return 'Processing';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
      default:
        return 'Unknown';
    }
  }
}
