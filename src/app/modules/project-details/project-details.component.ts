import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectDetailsService } from './project-details.service';
import { Project, FileItem, Job, AnalysisResult } from './project-details.models';
import { RunAnalysisButtonComponent } from './run-analysis-button.component';
import { FilesListComponent } from './files-list.component';
import { AnalysisHistoryComponent } from './analysis-history.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { JobService } from '../../core/services/job/job.service'; // Import JobService
import { JobProgressCardComponent } from '../../shared/ui/job-progress-card/job-progress-card.component'; // Import JobProgressCardComponent
import { JobStatus } from '../../core/models/job.model'; // Import JobStatus from core model

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RunAnalysisButtonComponent,
    FilesListComponent,
    AnalysisHistoryComponent,
    LoaderComponent,
    JobProgressCardComponent // Add JobProgressCardComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  project = signal<Project | null>(null);
  files = signal<FileItem[]>([]);
  jobs = signal<Job[]>([]);
  selectedJobId = signal<string | null>(null);
  analysisResult = signal<AnalysisResult | null>(null);
  loading = signal(true);
  activeJobStatus = signal<JobStatus | null>(null); // Signal for active job status

  projectId!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private projectDetailsService: ProjectDetailsService,
    private jobService: JobService // Inject JobService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadProjectDetails();
  }

  loadProjectDetails(): void {
    this.loading.set(true);
    this.projectDetailsService.getProject(this.projectId).pipe(takeUntil(this.destroy$)).subscribe(project => {
      this.project.set(project);
      this.loading.set(false);

      // Check for an active job and subscribe to its status
      const activeJob = project.jobs?.find((job: Job) => {
        const status = job.status as unknown as JobStatus;
        return status.state === 'IN_PROGRESS' || status.state === 'PENDING';
      });
      if (activeJob) {
        this.jobService.subscribeToJob(activeJob.id) // Use activeJob.id
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (status: JobStatus) => {
              this.activeJobStatus.set(status);
              if (status.state === 'COMPLETED' || status.state === 'FAILED' || status.state === 'CANCELLED') {
                this.loadProjectDetails(); // Refresh project data on job completion/failure
              }
            },
            error: (err) => console.error('Error subscribing to job status:', err)
          });
      } else {
        this.activeJobStatus.set(null); // No active job
      }
    });

    this.projectDetailsService.getFiles(this.projectId).pipe(takeUntil(this.destroy$)).subscribe(files => this.files.set(files));
    this.projectDetailsService.getJobs(this.projectId).pipe(takeUntil(this.destroy$)).subscribe(jobs => this.jobs.set(jobs));
  }

  onViewResult(jobId: string): void {
    this.selectedJobId.set(jobId);
    this.projectDetailsService.getAnalysisResult(jobId).pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.analysisResult.set(result);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
