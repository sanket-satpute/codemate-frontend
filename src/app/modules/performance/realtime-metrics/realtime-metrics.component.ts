import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceMetrics } from '../performance.model';

@Component({
  selector: 'app-realtime-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './realtime-metrics.component.html',
  styleUrls: ['./realtime-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtimeMetricsComponent {
  @Input() metrics: PerformanceMetrics[] = [];

  get latestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }
}
