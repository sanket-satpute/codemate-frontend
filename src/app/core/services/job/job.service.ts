import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer, throwError, Subject, merge, of } from 'rxjs'; // Removed 'defer' and 'race'
import { switchMap, takeUntil, catchError, retry, tap, shareReplay, distinctUntilChanged, timeout } from 'rxjs/operators'; // Removed 'filter' and 'take'
import { environment } from '../../../../environments/environment';
import { JobStatus } from '../../../core/models/job.model';
import { WebSocketService } from '../../../core/services/websocket/websocket.service';
import { ToastService } from '../../../core/services/toast';

const POLLING_INTERVAL_MS = 2000;
const WEBSOCKET_FALLBACK_THRESHOLD_MS = 4000;
const MAX_RETRIES = 5;

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private http = inject(HttpClient);
  private wsService = inject(WebSocketService);
  private toastService = inject(ToastService);
  private apiUrl = environment.apiUrl;

  private jobStatusSignals: { [jobId: string]: WritableSignal<JobStatus | null> } = {};

  getJobStatusSignal(jobId: string): WritableSignal<JobStatus | null> {
    if (!this.jobStatusSignals[jobId]) {
      this.jobStatusSignals[jobId] = signal<JobStatus | null>(null);
    }
    return this.jobStatusSignals[jobId];
  }

  getJobOnce(jobId: string): Observable<JobStatus> {
    return this.http.get<JobStatus>(`${this.apiUrl}/job/${jobId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Failed to fetch job status for ${jobId}:`, error);
        if (error.status >= 400 && error.status < 500) {
            this.toastService.showError('Error', `Job ${jobId} not found or access denied.`);
        }
        return throwError(() => error);
      })
    );
  }

  private pollJobStatusHttp(jobId: string, intervalMs: number, stopPolling$: Subject<void>): Observable<JobStatus> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getJobOnce(jobId).pipe(
        retry({
          count: MAX_RETRIES,
          delay: (error, retryCount) => {
            if (error instanceof HttpErrorResponse && error.status >= 500 && retryCount < MAX_RETRIES) {
              const delayTime = Math.pow(2, retryCount) * 1000;
              console.warn(`Retrying job status fetch for ${jobId} in ${delayTime / 1000}s.`);
              return timer(delayTime);
            }
            return throwError(() => error);
          },
        }),
        catchError((error: HttpErrorResponse) => {
          this.toastService.showError('Error', `Failed to poll job ${jobId} status.`);
          const jobSignal = this.getJobStatusSignal(jobId);
          const currentStatus = jobSignal();
          if (currentStatus) {
            jobSignal.set({ ...currentStatus, state: 'FAILED', message: 'Polling failed' });
          }
          stopPolling$.next();
          return throwError(() => error);
        })
      )),
      tap(status => {
        const jobSignal = this.getJobStatusSignal(jobId);
        jobSignal.set(status);
        if (status.state === 'COMPLETED' || status.state === 'FAILED' || status.state === 'CANCELLED') {
          stopPolling$.next();
        }
      }),
      takeUntil(stopPolling$)
    );
  }

  subscribeToJob(jobId: string, intervalMs: number = POLLING_INTERVAL_MS): Observable<JobStatus> {
    const stopPolling$ = new Subject<void>();
    const jobSignal = this.getJobStatusSignal(jobId);

    const ws$ = this.wsService.onTopic(`/topic/job/${jobId}`).pipe(
      tap((status: JobStatus) => {
        console.log(`WebSocket event for job ${jobId}:`, status);
        jobSignal.set(status);
        if (status.state === 'COMPLETED' || status.state === 'FAILED' || status.state === 'CANCELLED') {
          stopPolling$.next();
        }
      }),
      takeUntil(stopPolling$)
    );

    const http$ = this.pollJobStatusHttp(jobId, intervalMs, stopPolling$);

    const initialStatus$ = this.getJobOnce(jobId).pipe(
        tap(status => jobSignal.set(status))
    );

    const combined$ = initialStatus$.pipe(
        switchMap(initialStatus => {
            if (initialStatus.state === 'COMPLETED' || initialStatus.state === 'FAILED' || initialStatus.state === 'CANCELLED') {
                return of(initialStatus);
            }

            if (!this.wsService.isConnected()) {
                return http$;
            }

            const wsWithTimeout$ = ws$.pipe(
                timeout(WEBSOCKET_FALLBACK_THRESHOLD_MS),
                catchError(() => {
                    console.warn(`WebSocket timed out for job ${jobId}. Falling back to HTTP polling.`);
                    return http$;
                })
            );

            return merge(wsWithTimeout$, http$).pipe(
                distinctUntilChanged((prev, curr) => prev.state === curr.state && prev.progress === curr.progress)
            );
        })
    );

    return combined$.pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        takeUntil(stopPolling$)
    );
  }
}
