import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceMetrics } from '../performance.model';

@Component({
  selector: 'app-timeline-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-graph.component.html',
  styleUrls: ['./timeline-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineGraphComponent implements OnChanges {
  @Input() metrics: PerformanceMetrics[] = [];

  // SVG drawing properties
  viewBox = '0 0 1000 200';
  chartWidth = 1000;
  chartHeight = 150;
  padding = 50;

  cpuLine = '';
  memoryLine = '';
  responseTimeLine = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metrics'] && this.metrics.length > 0) {
      this.drawGraph();
    }
  }

  private drawGraph(): void {
    if (this.metrics.length === 0) {
      this.cpuLine = '';
      this.memoryLine = '';
      this.responseTimeLine = '';
      return;
    }

    const maxDataPoints = 50;
    const startIndex = Math.max(0, this.metrics.length - maxDataPoints);
    const displayedMetrics = this.metrics.slice(startIndex);

    const minCpu = 0;
    const maxCpu = 100;
    const minMemory = 0;
    const maxMemory = Math.max(...displayedMetrics.map(m => m.memory), 100); // Dynamic max memory
    const minResponseTime = 0;
    const maxResponseTime = Math.max(...displayedMetrics.map(m => m.responseTime), 100); // Dynamic max response time

    const getX = (index: number) => (index / (displayedMetrics.length - 1)) * (this.chartWidth - 2 * this.padding) + this.padding;

    const getY = (value: number, min: number, max: number) => {
      const normalizedValue = (value - min) / (max - min);
      return this.chartHeight - (normalizedValue * this.chartHeight);
    };

    this.cpuLine = displayedMetrics.map((m, i) => `${getX(i)},${getY(m.cpu, minCpu, maxCpu)}`).join(' ');
    this.memoryLine = displayedMetrics.map((m, i) => `${getX(i)},${getY(m.memory, minMemory, maxMemory)}`).join(' ');
    this.responseTimeLine = displayedMetrics.map((m, i) => `${getX(i)},${getY(m.responseTime, minResponseTime, maxResponseTime)}`).join(' ');
  }
}
