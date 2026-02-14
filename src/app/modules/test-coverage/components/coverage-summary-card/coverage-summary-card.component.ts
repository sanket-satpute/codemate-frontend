import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverageSummary } from '../../test-coverage.model';

@Component({
  selector: 'app-coverage-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coverage-summary-card.component.html',
  styleUrls: ['./coverage-summary-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoverageSummaryCardComponent {
  @Input() summary: CoverageSummary | null = null;

  getStrokeDashArray(): string {
    if (!this.summary) {
      return '0, 283';
    }
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const progress = this.summary.coveragePercent / 100;
    const dashoffset = circumference * (1 - progress);
    return `${circumference - dashoffset}, ${dashoffset}`;
  }
}
