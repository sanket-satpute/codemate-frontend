import { Injectable, NgZone, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceMetrics, Bottleneck } from './performance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = environment.apiUrl;
  private eventSource: EventSource | undefined;
  
  metrics = signal<PerformanceMetrics[]>([]);

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  getRealtimeMetrics(projectId: string): Observable<PerformanceMetrics> {
    return new Observable(observer => {
      const url = `${this.apiUrl}/performance/stream/${projectId}`;
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          const metrics = JSON.parse(event.data) as PerformanceMetrics;
          this.metrics.update(currentMetrics => [...currentMetrics, metrics]);
          observer.next(metrics);
        });
      };

      this.eventSource.onerror = (error) => {
        this.ngZone.run(() => {
          observer.error('SSE connection failed: ' + error);
          this.eventSource?.close();
        });
      };

      return () => {
        this.eventSource?.close();
        console.log('SSE connection closed.');
      };
    });
  }

  getBottlenecks(projectId: string): Observable<Bottleneck[]> {
    return this.http.get<Bottleneck[]>(`${this.apiUrl}/performance/bottlenecks/${projectId}`);
  }

  stopRealtimeMetrics(): void {
    this.eventSource?.close();
    console.log('SSE connection explicitly stopped.');
  }
}
