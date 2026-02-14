import { Component, OnInit, signal, WritableSignal, computed, Signal, effect } from '@angular/core'; // Import 'effect'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalysisResultService } from './analysis-result.service';
import { AnalysisResult, AnalysisSummary, FileWithIssues, Issue, Severity } from './analysis-result.model';
import { ResultSummaryComponent } from './result-summary/result-summary.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { SeverityFilterComponent } from './severity-filter/severity-filter.component';
import { FindingsListComponent } from './findings-list/findings-list.component';
import { CodeViewerComponent } from './code-viewer/code-viewer.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

interface ChartSlice {
  label: string;
  value: number;
  percentage: number;
  color: string;
  dasharray: string;
  dashoffset: number;
}

@Component({
  selector: 'app-analysis-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ResultSummaryComponent,
    FileTreeComponent,
    SeverityFilterComponent,
    FindingsListComponent,
    CodeViewerComponent,
    LoaderComponent,
    EmptyStateComponent,
    ButtonComponent
  ],
  templateUrl: './analysis-result.component.html',
  styleUrls: ['./analysis-result.component.scss']
})
export class AnalysisResultComponent implements OnInit {
  result: WritableSignal<AnalysisResult | null> = signal(null);
  selectedFile: WritableSignal<FileWithIssues | null> = signal(null);
  selectedIssue: WritableSignal<Issue | null> = signal(null);
  activeSeverities: WritableSignal<Severity[]> = signal(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
  loading = signal(true);

  projectId: string | null = null;
  jobId: string | null = null;
  projectName: string = '';

  chartData: Signal<ChartSlice[]> = computed(() => this.calculateChartData());

  emptyCodeViewerSvg: SafeHtml; // Property to hold sanitized SVG

  hasRequiredParams: Signal<boolean> = computed(() => !!this.projectId && !!this.jobId);

  overallStatus: Signal<string> = computed(() => {
    const summary = this.result()?.summary;
    if (!summary) return 'UNKNOWN';

    if (summary.critical > 0 || summary.high > 0) {
      return 'FAILURE';
    } else if (summary.medium > 0 || summary.low > 0) {
      return 'WARNING';
    } else {
      return 'SUCCESS';
    }
  });

  filteredIssues: Signal<Issue[]> = computed(() => {
    const file = this.selectedFile();
    const severities = this.activeSeverities();
    if (!file) return [];
    return file.issues.filter(issue => severities.includes(issue.severity));
  });

  constructor(
    private route: ActivatedRoute,
    private analysisResultService: AnalysisResultService,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {
    // Sanitize SVG in the constructor or ngOnInit
    const svgCodeIcon = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5L21 12L13.5 19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5 19.5L3 12L10.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    this.emptyCodeViewerSvg = this.sanitizer.bypassSecurityTrustHtml(svgCodeIcon);
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.projectName = this.projectId || 'Unknown Project';
    
    if (this.hasRequiredParams()) {
      this.loadAnalysisResult();
    } else {
      this.projectName = 'Dummy Project';
      this.result.set(this.generateDummyAnalysisResult());
      this.loading.set(false);
    }
  }

  loadAnalysisResult(): void {
    this.loading.set(true);
    if (this.jobId) {
      this.analysisResultService.getAnalysisResult(this.jobId!).subscribe({
        next: (data) => {
          this.result.set(data);
          if (data.files.length > 0) {
            this.selectedFile.set(data.files[0]);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load analysis result', err);
          this.loading.set(false);
        }
      });
    } // Closing brace for if (this.jobId)
  } // Closing brace for loadAnalysisResult()

  private calculateChartData(): ChartSlice[] {
    const summary = this.result()?.summary;
    if (!summary || summary.totalIssues === 0) {
      return [];
    }

    const chartSlices: ChartSlice[] = [];
    const total = summary.totalIssues;
    let currentDashOffset = 0;

    const severities: { label: string; value: number; color: string; }[] = [
      { label: 'Critical', value: summary.critical, color: 'var(--color-error)' },
      { label: 'High', value: summary.high, color: 'var(--color-warning)' },
      { label: 'Medium', value: summary.medium, color: 'var(--color-primary-indigo-600)' }, // Using primary indigo for medium
      { label: 'Low', value: summary.low, color: 'var(--color-accent-cyan-400)' }, // Using accent cyan for low
    ];

    severities.forEach(s => {
      if (s.value > 0) {
        const percentage = (s.value / total) * 100;
        const dasharray = `${percentage} ${100 - percentage}`; // Percentage and remaining arc length
        const dashoffset = 100 - currentDashOffset; // Start from previous end

        chartSlices.push({
          label: s.label,
          value: s.value,
          percentage: Math.round(percentage),
          color: s.color,
          dasharray: dasharray,
          dashoffset: dashoffset,
        });
        currentDashOffset += percentage;
      }
    });

    return chartSlices;
  }

  private generateDummyAnalysisResult(): AnalysisResult {
    const dummyIssues: Issue[] = [
      { id: 'sec-001', severity: 'CRITICAL', message: 'SQL Injection vulnerability detected', suggestion: 'Sanitize all user inputs', line: 15 },
      { id: 'bug-002', severity: 'HIGH', message: 'Null pointer dereference', suggestion: 'Add null checks before dereferencing', line: 30 },
      { id: 'perf-003', severity: 'MEDIUM', message: 'Inefficient loop detected', suggestion: 'Optimize loop for better performance', line: 55 },
      { id: 'style-004', severity: 'LOW', message: 'Missing documentation comment', suggestion: 'Add JSDoc comments for clarity', line: 70 },
      { id: 'sec-005', severity: 'CRITICAL', message: 'Cross-site scripting (XSS) vulnerability', suggestion: 'Escape all outputs', line: 82 },
      { id: 'bug-006', severity: 'HIGH', message: 'Memory leak in module', suggestion: 'Review memory allocation and deallocation', line: 95 },
      { id: 'perf-007', severity: 'MEDIUM', message: 'Excessive database queries', suggestion: 'Implement caching or batching', line: 110 },
    ];

    const dummyFiles: FileWithIssues[] = [
      { path: 'src/app/services/auth.service.ts', issues: [dummyIssues[0], dummyIssues[3]] },
      { path: 'src/app/components/data-table.ts', issues: [dummyIssues[1], dummyIssues[2]] },
    ];

    const dummySummary: AnalysisSummary = {
      totalIssues: dummyIssues.length,
      critical: dummyIssues.filter(i => i.severity === 'CRITICAL').length,
      high: dummyIssues.filter(i => i.severity === 'HIGH').length,
      medium: dummyIssues.filter(i => i.severity === 'MEDIUM').length,
      low: dummyIssues.filter(i => i.severity === 'LOW').length,
    };

    return {
      summary: dummySummary,
      files: dummyFiles,
    };
  }

  onFileSelected(file: FileWithIssues): void {
    this.selectedFile.set(file);
    this.selectedIssue.set(null);
  }

  onIssueSelected(issue: Issue): void {
    this.selectedIssue.set(issue);
  }

  onSeveritiesChanged(severities: Severity[]): void {
    this.activeSeverities.set(severities);
  }

  getFileName(filePath: string): string {
    const parts = filePath.split(/[\\/]/);
    return parts[parts.length - 1];
  }
}
