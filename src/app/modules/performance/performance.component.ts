import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, finalize } from 'rxjs';

import { PerformanceService } from './performance.service';
import { Bottleneck, PerformanceMetrics } from './performance.model';

import { RealtimeMetricsComponent } from './realtime-metrics/realtime-metrics.component';
import { TimelineGraphComponent } from './timeline-graph/timeline-graph.component';
import { BottleneckCardComponent } from './bottleneck-card/bottleneck-card.component';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule,
    RealtimeMetricsComponent,
    TimelineGraphComponent,
    BottleneckCardComponent,
  ],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit, OnDestroy {
  metrics = signal<PerformanceMetrics[]>([]);
  bottlenecks = signal<Bottleneck[]>([]);
  loadingBottlenecks = signal(true);
  streamingMetrics = signal(false);
  
  private projectId!: string;
  private metricsSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private performanceService: PerformanceService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadBottlenecks();
    this.startMetricsStream();
  }

  ngOnDestroy(): void {
    this.stopMetricsStream();
  }

  loadBottlenecks(): void {
    this.loadingBottlenecks.set(true);
    this.performanceService.getBottlenecks(this.projectId)
      .pipe(finalize(() => this.loadingBottlenecks.set(false)))
      .subscribe(data => {
        this.bottlenecks.set(data);
      });
  }

  startMetricsStream(): void {
    this.streamingMetrics.set(true);
    this.metricsSubscription = this.performanceService.getRealtimeMetrics(this.projectId)
      .subscribe({
        next: (metric) => {
          this.metrics.update(currentMetrics => [...currentMetrics, metric]);
        },
        error: (err) => {
          console.error('Error streaming metrics:', err);
          this.streamingMetrics.set(false);
          // Optionally, show a toast warning to the user
        }
      });
  }

  stopMetricsStream(): void {
    this.performanceService.stopRealtimeMetrics();
    this.metricsSubscription?.unsubscribe();
    this.streamingMetrics.set(false);
  }
}
