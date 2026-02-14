import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Job, JobStatus } from './project-details.models';
import { ProjectDetailsService } from './project-details.service';
import { WebSocketService, JobStatusUpdate } from '../../core/services/websocket.service';

@Component({
  selector: 'app-run-analysis-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './run-analysis-button.component.html',
  styleUrls: ['./run-analysis-button.component.scss']
})
export class RunAnalysisButtonComponent implements OnInit, OnDestroy {
  @Input() projectId!: string;
  
  job: Job | null = null;
  jobStatus: JobStatus | null = null;
  progress = 0;
  
  private jobStatusSubscription: Subscription | undefined;

  constructor(
    private projectDetailsService: ProjectDetailsService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.subscribeToJobStatus();
  }

  ngOnDestroy(): void {
    this.jobStatusSubscription?.unsubscribe();
  }

  runAnalysis(): void {
    this.projectDetailsService.runAnalysis(this.projectId).subscribe(job => {
      this.job = job;
      this.jobStatus = job.status;
      this.updateProgress();
    });
  }

  private subscribeToJobStatus(): void {
    this.jobStatusSubscription = this.webSocketService
      .subscribeToJobStatus(this.projectId)
      .subscribe((statusUpdate: JobStatusUpdate) => {
        if (statusUpdate.projectId === this.projectId) {
          this.jobStatus = statusUpdate.status;
          this.updateProgress();
        }
      });
  }

  private updateProgress(): void {
    switch (this.jobStatus) {
      case JobStatus.CREATED:
        this.progress = 25;
        break;
      case JobStatus.PROCESSING:
        this.progress = 60;
        break;
      case JobStatus.COMPLETED:
        this.progress = 100;
        setTimeout(() => {
          this.job = null;
          this.jobStatus = null;
          this.progress = 0;
        }, 2000); // Reset after 2 seconds
        break;
      case JobStatus.FAILED:
        this.progress = 100; // Or some other failure indication
        break;
      default:
        this.progress = 0;
    }
  }

  get isJobRunning(): boolean {
    return this.jobStatus === JobStatus.CREATED || this.jobStatus === JobStatus.PROCESSING;
  }
}
