import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratedTestCase } from '../../test-coverage.model';
import { TestCoverageService } from '../../test-coverage.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-test-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-generator.component.html',
  styleUrls: ['./test-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGeneratorComponent {
  @Input() projectId!: string;
  @Input() selectedFile: { filePath: string } | null = null;
  @Output() testGenerated = new EventEmitter<GeneratedTestCase>();

  loading = signal(false);

  constructor(private testCoverageService: TestCoverageService) {}

  generateTests(): void {
    if (!this.selectedFile) {
      return;
    }

    this.loading.set(true);
    this.testCoverageService.generateTestCases(this.projectId, this.selectedFile.filePath)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(testCase => {
        this.testGenerated.emit(testCase);
      });
  }
}
