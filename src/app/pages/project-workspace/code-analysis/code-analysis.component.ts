import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AnalysisService } from '../../../core/services/analysis/analysis.service';
import { ProjectService } from '../../../core/services/project/project.service';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog/confirm-dialog.service';
import { AnalysisResult, AnalysisFinding } from '../../../core/models/analysis.model';

@Component({
  selector: 'app-code-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-analysis.component.html',
  styleUrl: './code-analysis.component.scss'
})
export class CodeAnalysisComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private analysisService = inject(AnalysisService);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);

  projectId = '';
  projectName = signal('');
  isLoading = signal(true);
  isAnalyzing = signal(false);
  analyzeProgress = signal(0);
  errorMessage = signal<string | null>(null);

  // Analysis data
  analysisJobs = signal<AnalysisResult[]>([]);
  latestJob = signal<AnalysisResult | null>(null);
  projectTotalFiles = signal(0);

  // Parsed findings from latest job result
  findings = signal<AnalysisFinding[]>([]);
  analysisSummary = signal<string>('');
  riskLevel = signal<string>('');

  // Filter
  selectedSeverity = signal<string>('all');

  get filteredFindings(): AnalysisFinding[] {
    const severity = this.selectedSeverity();
    const all = this.findings();
    if (severity === 'all') return all;
    return all.filter(f => f.severity === severity);
  }

  get severityCounts(): Record<string, number> {
    const all = this.findings();
    return {
      all: all.length,
      error: all.filter(f => f.severity === 'error').length,
      warning: all.filter(f => f.severity === 'warning').length,
      info: all.filter(f => f.severity === 'info').length,
    };
  }

  private parseJobResult(job: AnalysisResult | null): void {
    if (!job?.result) {
      this.findings.set([]);
      this.analysisSummary.set('');
      this.riskLevel.set('');
      return;
    }
    try {
      const parsed = JSON.parse(job.result);
      this.analysisSummary.set(parsed.summary ?? '');
      this.riskLevel.set(parsed.riskLevel ?? '');
      const issues: AnalysisFinding[] = (parsed.issues ?? []).map((i: any) => ({
        file: i.file ?? 'Unknown',
        lineNumber: i.lineNumber ?? 0,
        severity: (['error', 'warning', 'info'].includes(i.severity) ? i.severity : 'info') as AnalysisFinding['severity'],
        message: i.message ?? '',
        suggestion: i.suggestion ?? '',
      }));
      this.findings.set(issues);
    } catch (e) {
      console.error('Failed to parse analysis result JSON', e);
      this.findings.set([]);
      this.analysisSummary.set(job.result);
      this.riskLevel.set('');
    }
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    if (!this.projectId) {
      this.errorMessage.set('No project ID provided.');
      this.isLoading.set(false);
      return;
    }

    // Load project name and file count
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (p) => {
        this.projectName.set(p.name);
        this.projectTotalFiles.set(p.totalFiles ?? 0);
      },
      error: () => this.projectName.set('Unknown Project'),
    });

    this.loadAnalysis();
  }

  loadAnalysis(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.analysisService.getAnalysisResults(this.projectId).subscribe({
      next: (jobs) => {
        this.analysisJobs.set(jobs ?? []);
        const sorted = [...(jobs ?? [])].sort((a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        const latest = sorted[0] ?? null;
        this.latestJob.set(latest);
        this.parseJobResult(latest);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load analysis', err);
        this.errorMessage.set('Failed to load analysis data.');
        this.isLoading.set(false);
      },
    });
  }

  filterBySeverity(severity: string): void {
    this.selectedSeverity.set(severity);
  }

  startAnalysis(): void {
    // Guard: project must have files before analysis
    if (this.projectTotalFiles() === 0) {
      this.confirmDialogService.open({
        title: 'No Files in Project',
        message: 'This project has no files to analyze. Please add files first before running analysis.',
        confirmButtonText: 'Add Files',
        cancelButtonText: 'Cancel',
      });

      this.confirmDialogService.confirmResult$.pipe(take(1)).subscribe(confirmed => {
        if (confirmed) {
          this.router.navigate(['/project-workspace', this.projectId, 'overview']);
        }
      });
      return;
    }

    this.isAnalyzing.set(true);
    this.analyzeProgress.set(0);
    this.startFakeProgress();

    this.projectService.runAnalysis(this.projectId).subscribe({
      next: () => {
        this.toastService.showInfo('Analyzing your code... This may take a minute.', 'Code Analysis');
        this.pollForCompletion();
      },
      error: () => {
        this.isAnalyzing.set(false);
        this.analyzeProgress.set(0);
        this.toastService.showError('Failed to start analysis.');
      },
    });
  }

  private progressInterval: any;
  private pollingInterval: any;

  ngOnDestroy(): void {
    clearInterval(this.progressInterval);
    clearInterval(this.pollingInterval);
  }

  private startFakeProgress(): void {
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      const current = this.analyzeProgress();
      if (current < 90) {
        // Slow down as it gets higher
        const increment = Math.max(0.5, (90 - current) / 30);
        this.analyzeProgress.set(Math.min(90, current + increment));
      }
    }, 1000);
  }

  private pollForCompletion(): void {
    let attempts = 0;
    const maxAttempts = 30;
    this.pollingInterval = setInterval(() => {
      attempts++;
      this.analysisService.getAnalysisResults(this.projectId).subscribe({
        next: (jobs) => {
          const sorted = [...(jobs ?? [])].sort((a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
          );
          const latest = sorted[0];
          if (latest && (latest.status === 'COMPLETED' || latest.status === 'FAILED')) {
            clearInterval(this.pollingInterval);
            clearInterval(this.progressInterval);
            this.analyzeProgress.set(100);

            setTimeout(() => {
              this.isAnalyzing.set(false);
              this.analyzeProgress.set(0);
              this.analysisJobs.set(jobs ?? []);
              this.latestJob.set(latest);
              this.parseJobResult(latest);
              this.isLoading.set(false);
              this.showCompletionNotification(latest);
            }, 600);
          }
          if (attempts >= maxAttempts) {
            clearInterval(this.pollingInterval);
            clearInterval(this.progressInterval);
            this.isAnalyzing.set(false);
            this.analyzeProgress.set(0);
            this.loadAnalysis();
          }
        },
      });
    }, 5000);
  }

  private showCompletionNotification(job: AnalysisResult): void {
    if (job.status === 'FAILED') {
      this.toastService.showError(
        'Code analysis failed. Please check your project files and try again.',
        'Analysis Failed',
        6000
      );
      return;
    }

    // Parse the result to build a rich notification
    try {
      const parsed = JSON.parse(job.result ?? '{}');
      const issues = parsed.issues ?? [];
      const risk = parsed.riskLevel ?? 'UNKNOWN';
      const errors = issues.filter((i: any) => i.severity === 'error').length;
      const warnings = issues.filter((i: any) => i.severity === 'warning').length;
      const infos = issues.filter((i: any) => i.severity === 'info').length;

      if (issues.length === 0) {
        this.toastService.showSuccess(
          'No issues found! Your code looks clean. Risk: ' + risk,
          'Analysis Passed',
          6000
        );
      } else {
        const summary = `Found ${issues.length} findings: ${errors} errors, ${warnings} warnings, ${infos} info. Risk: ${risk}`;
        if (errors > 0) {
          this.toastService.showError(summary, 'Analysis Complete', 8000);
        } else if (warnings > 0) {
          this.toastService.showWarning(summary, 'Analysis Complete', 8000);
        } else {
          this.toastService.showSuccess(summary, 'Analysis Complete', 6000);
        }
      }
    } catch {
      this.toastService.showSuccess('Analysis completed!', 'Code Analysis', 5000);
    }
  }

  severityClass(s: string): string {
    switch (s) {
      case 'error': return 'critical';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return '';
    }
  }

  goToOverview(): void {
    this.router.navigate([`/project-workspace/${this.projectId}/overview`]);
  }
}
