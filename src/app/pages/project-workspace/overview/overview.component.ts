import { Component, OnInit, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, take } from 'rxjs';
import { ProjectService } from '../../../core/services/project/project.service';
import { AnalysisService } from '../../../core/services/analysis/analysis.service';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog/confirm-dialog.service';
import { Project, ProjectFileInfo } from '../../../core/models/project.model';

interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
  accent?: 'primary' | 'success' | 'error' | 'warning';
}

interface RecentJob {
  time: string;
  description: string;
  icon: string;
  statusClass: string;
}

interface FileTypeStat {
  extension: string;
  count: number;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private analysisService = inject(AnalysisService);
  private toastService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);

  projectId = '';
  isLoading = signal(true);
  isAnalysisRunning = signal(false);
  errorMessage = signal<string | null>(null);

  // Real project data
  project = signal<Project | null>(null);
  projectName = '';
  projectDescription = '';
  projectMetadata = {
    createdDate: '',
    lastUpdated: '',
    status: ''
  };

  // File info
  fileStats = signal<{ totalFiles: number; totalSize: string; types: FileTypeStat[] }>({
    totalFiles: 0,
    totalSize: '0 B',
    types: []
  });

  // Analysis jobs data
  analysisJobs = signal<any[]>([]);
  quickStats = signal<QuickStat[]>([]);
  recentActivities = signal<RecentJob[]>([]);

  // Derived from analysis if available
  hasAnalysis = signal(false);
  lastJobStatus = signal('');
  lastJobModel = signal('');

  // Computed: show delete confirmation
  showDeleteConfirm = signal(false);

  // File management
  projectFiles = signal<ProjectFileInfo[]>([]);
  isUploadingFiles = signal(false);
  replacingFileId = signal<string | null>(null);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('replaceFileInput') replaceFileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    if (!this.projectId) {
      this.errorMessage.set('No project ID provided.');
      this.isLoading.set(false);
      return;
    }
    this.loadProjectData();
  }

  loadProjectData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      project: this.projectService.getProjectById(this.projectId),
      jobs: this.analysisService.getAnalysisResults(this.projectId),
    }).subscribe({
      next: ({ project, jobs }) => {
        this.project.set(project as any);
        this.projectName = project.name;
        this.projectDescription = project.description || 'No description provided.';
        this.projectMetadata = {
          createdDate: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A',
          lastUpdated: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A',
          status: project.status ?? 'ACTIVE',
        };

        // File stats
        const types: FileTypeStat[] = [];
        if (project.fileTypeBreakdown) {
          for (const [ext, count] of Object.entries(project.fileTypeBreakdown)) {
            types.push({ extension: ext, count });
          }
          types.sort((a, b) => b.count - a.count);
        }
        this.fileStats.set({
          totalFiles: project.totalFiles ?? 0,
          totalSize: this.formatSize(project.totalFileSize ?? 0),
          types: types.slice(0, 6),
        });

        // Individual files list
        this.projectFiles.set(project.files ?? []);

        // Analysis jobs
        this.analysisJobs.set(jobs ?? []);
        const sortedJobs = [...(jobs ?? [])].sort((a: any, b: any) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );

        this.hasAnalysis.set(sortedJobs.length > 0);
        this.lastJobStatus.set(sortedJobs[0]?.status ?? '');
        this.lastJobModel.set(sortedJobs[0]?.model ?? '');

        // Quick stats
        const completedJobs = sortedJobs.filter((j: any) => j.status === 'COMPLETED').length;
        const failedJobs = sortedJobs.filter((j: any) => j.status === 'FAILED').length;
        const successRate = sortedJobs.length > 0
          ? Math.round((completedJobs / sortedJobs.length) * 100) + '%'
          : 'N/A';

        this.quickStats.set([
          { label: 'Total Analyses', value: sortedJobs.length, icon: 'fas fa-flask', accent: 'primary' },
          { label: 'Completed', value: completedJobs, icon: 'fas fa-check-circle', accent: 'success' },
          { label: 'Failed', value: failedJobs, icon: 'fas fa-times-circle', accent: 'error' },
          { label: 'Success Rate', value: successRate, icon: 'fas fa-chart-line', accent: 'warning' },
        ]);

        // Recent activities from jobs
        this.recentActivities.set(
          sortedJobs.slice(0, 5).map((job: any) => ({
            time: job.createdAt ? this.timeAgo(new Date(job.createdAt)) : 'Unknown',
            description: `Analysis ${job.status?.toLowerCase() ?? 'created'}${job.model ? ' · ' + job.model : ''}`,
            icon: this.jobIcon(job.status),
            statusClass: this.jobStatusClass(job.status),
          }))
        );

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load project data. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  reRunAnalysis(): void {
    if (this.isAnalysisRunning()) return;

    // Guard: project must have files before analysis
    if (this.fileStats().totalFiles === 0) {
      this.confirmDialogService.open({
        title: 'No Files in Project',
        message: 'This project has no files to analyze. Please add files first before running analysis.',
        confirmButtonText: 'Add Files',
        cancelButtonText: 'Cancel',
      });

      this.confirmDialogService.confirmResult$.pipe(take(1)).subscribe(confirmed => {
        if (confirmed) {
          this.triggerAddFiles();
        }
      });
      return;
    }

    this.isAnalysisRunning.set(true);

    this.projectService.runAnalysis(this.projectId).subscribe({
      next: () => {
        this.toastService.showSuccess('Analysis started successfully.');
        this.isAnalysisRunning.set(false);
        this.loadProjectData();
      },
      error: () => {
        this.toastService.showError('Failed to start analysis.');
        this.isAnalysisRunning.set(false);
      },
    });
  }

  deleteProject(): void {
    this.confirmDialogService.open({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${this.projectName}"? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    this.confirmDialogService.confirmResult$.pipe(take(1)).subscribe(confirmed => {
      if (confirmed) {
        this.projectService.deleteProject(this.projectId).subscribe({
          next: () => {
            this.toastService.showSuccess('Project deleted.');
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.toastService.showError('Failed to delete project.');
          },
        });
      }
    });
  }

  viewFullAnalysis(): void {
    this.router.navigate(['/project-workspace', this.projectId, 'code-analysis']);
  }

  openAIChat(): void {
    this.router.navigate(['/project-workspace', this.projectId, 'ai-chat']);
  }

  // ─── File Management Actions ─────────────────────────────────────────

  triggerAddFiles(): void {
    this.fileInput?.nativeElement?.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.isUploadingFiles.set(true);

    this.projectService.addFilesToProject(this.projectId, files).subscribe({
      next: () => {
        this.toastService.showSuccess(`${files.length} file(s) added successfully.`);
        this.isUploadingFiles.set(false);
        this.loadProjectData();
      },
      error: () => {
        this.toastService.showError('Failed to upload files.');
        this.isUploadingFiles.set(false);
      },
    });

    // Reset file input so same file can be selected again
    input.value = '';
  }

  triggerReplaceFile(fileId: string): void {
    this.replacingFileId.set(fileId);
    this.replaceFileInput?.nativeElement?.click();
  }

  onReplaceFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileId = this.replacingFileId();
    if (!input.files || input.files.length === 0 || !fileId) return;

    const file = input.files[0];

    this.projectService.replaceFileInProject(this.projectId, fileId, file).subscribe({
      next: () => {
        this.toastService.showSuccess('File replaced successfully.');
        this.replacingFileId.set(null);
        this.loadProjectData();
      },
      error: () => {
        this.toastService.showError('Failed to replace file.');
        this.replacingFileId.set(null);
      },
    });

    input.value = '';
  }

  deleteFile(file: ProjectFileInfo): void {
    this.confirmDialogService.open({
      title: 'Delete File',
      message: `Are you sure you want to delete "${file.filename}"? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    this.confirmDialogService.confirmResult$.pipe(take(1)).subscribe(confirmed => {
      if (confirmed) {
        this.projectService.deleteFileFromProject(this.projectId, file.id).subscribe({
          next: () => {
            this.toastService.showSuccess(`"${file.filename}" deleted.`);
            this.loadProjectData();
          },
          error: () => {
            this.toastService.showError('Failed to delete file.');
          },
        });
      }
    });
  }

  getFileIcon(ext: string): string {
    const iconMap: Record<string, string> = {
      java: 'fab fa-java',
      py: 'fab fa-python',
      js: 'fab fa-js-square',
      ts: 'fab fa-js-square',
      html: 'fab fa-html5',
      css: 'fab fa-css3-alt',
      scss: 'fab fa-sass',
      json: 'fas fa-code',
      xml: 'fas fa-code',
      md: 'fas fa-file-alt',
      txt: 'fas fa-file-alt',
      pdf: 'fas fa-file-pdf',
      zip: 'fas fa-file-archive',
      sql: 'fas fa-database',
      yml: 'fas fa-cog',
      yaml: 'fas fa-cog',
    };
    return iconMap[ext?.toLowerCase()] || 'fas fa-file';
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  private jobIcon(status?: string): string {
    switch (status) {
      case 'COMPLETED': return 'fas fa-check-circle';
      case 'FAILED': return 'fas fa-times-circle';
      case 'IN_PROGRESS': return 'fas fa-spinner fa-spin';
      case 'PENDING': return 'fas fa-clock';
      default: return 'fas fa-play-circle';
    }
  }

  private jobStatusClass(status?: string): string {
    switch (status) {
      case 'COMPLETED': return 'status-success';
      case 'FAILED': return 'status-error';
      case 'IN_PROGRESS': return 'status-running';
      case 'PENDING': return 'status-warning';
      default: return 'status-default';
    }
  }
}
