import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bottleneck } from '../performance.model';

@Component({
  selector: 'app-bottleneck-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottleneck-card.component.html',
  styleUrls: ['./bottleneck-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottleneckCardComponent {
  @Input() item!: Bottleneck;

  getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (severity) {
      case 'low':
        return 'var(--success)';
      case 'medium':
        return 'var(--warning)';
      case 'high':
        return 'var(--error)';
      case 'critical':
        return 'var(--color-critical)';
      default:
        return 'var(--text-muted)';
    }
  }
}
