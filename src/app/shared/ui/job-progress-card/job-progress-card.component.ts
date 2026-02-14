import { Component, Input, ChangeDetectionStrategy, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JobStatus, JobState } from '../../../core/models/job.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-progress-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './job-progress-card.component.html',
  styleUrls: ['./job-progress-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobProgressCardComponent {
  @Input({ required: true }) status!: JobStatus;

  public progressMode: Signal<'determinate' | 'indeterminate'> = computed(() => 
    this.status.progress !== undefined && this.status.progress > 0 ? 'determinate' : 'indeterminate'
  );

  public isCompleted: Signal<boolean> = computed(() => this.status.state === 'COMPLETED');
  public isFailed: Signal<boolean> = computed(() => this.status.state === 'FAILED' || this.status.state === 'CANCELLED');
  public isRunning: Signal<boolean> = computed(() => this.status.state === 'PENDING' || this.status.state === 'IN_PROGRESS');
  
  public get viewResultsLink(): string[] | null {
    if (this.isCompleted() && this.status.projectId && this.status.resultId) {
      return ['/projects', this.status.projectId, 'results'];
    }
    return null;
  }
}
