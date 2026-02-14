import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactItem } from '../dependencies.model';

@Component({
  selector: 'app-impact-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpactAnalysisComponent {
  @Input() impactList: ImpactItem[] = [];

  getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (severity) {
      case 'low':
        return 'var(--color-success)';
      case 'medium':
        return 'var(--color-warning)';
      case 'high':
        return 'var(--color-danger)';
      case 'critical':
        return 'var(--color-critical)';
      default:
        return 'var(--color-text-secondary)';
    }
  }
}
