import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

import { TestCoverageService } from './test-coverage.service';
import { CoverageSummary, CoverageFile, GeneratedTestCase } from './test-coverage.model';

import { CoverageSummaryCardComponent } from './components/coverage-summary-card/coverage-summary-card.component';
import { CoverageFileListComponent } from './components/coverage-file-list/coverage-file-list.component';
import { TestGeneratorComponent } from './components/test-generator/test-generator.component';
import { TestPreviewModalComponent } from './components/test-preview-modal/test-preview-modal.component';

@Component({
  selector: 'app-test-coverage',
  standalone: true,
  imports: [
    CommonModule,
    CoverageSummaryCardComponent,
    CoverageFileListComponent,
    TestGeneratorComponent,
  ],
  templateUrl: './test-coverage.component.html',
  styleUrls: ['./test-coverage.component.scss']
})
export class TestCoverageComponent implements OnInit {
  loadingSummary = signal(true);
  loadingFiles = signal(true);
  summary = signal<CoverageSummary | null>(null);
  files = signal<CoverageFile[]>([]);
  selectedFile = signal<CoverageFile | null>(null);

  projectId!: string;

  constructor(
    private route: ActivatedRoute,
    private testCoverageService: TestCoverageService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadCoverageSummary();
    this.loadCoverageFiles();
  }

  loadCoverageSummary(): void {
    this.loadingSummary.set(true);
    this.testCoverageService.getCoverageSummary(this.projectId)
      .pipe(finalize(() => this.loadingSummary.set(false)))
      .subscribe(data => this.summary.set(data));
  }

  loadCoverageFiles(): void {
    this.loadingFiles.set(true);
    this.testCoverageService.getCoverageFiles(this.projectId)
      .pipe(finalize(() => this.loadingFiles.set(false)))
      .subscribe(data => this.files.set(data));
  }

  onGenerateTests(file: CoverageFile): void {
    this.selectedFile.set(file);
  }

  onTestGenerated(testCase: GeneratedTestCase): void {
    this.dialog.open(TestPreviewModalComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: { testCase }
    });
  }
}
