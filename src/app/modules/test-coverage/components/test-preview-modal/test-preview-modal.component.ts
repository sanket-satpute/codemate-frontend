import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { GeneratedTestCase } from '../../test-coverage.model';

@Component({
  selector: 'app-test-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-preview-modal.component.html',
  styleUrls: ['./test-preview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestPreviewModalComponent {
  constructor(
    public dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: { testCase: GeneratedTestCase }
  ) {}

  copyCode(): void {
    navigator.clipboard.writeText(this.data.testCase.testCode);
    // Optionally, show a toast notification
  }

  downloadTestFile(): void {
    const blob = new Blob([this.data.testCase.testCode], { type: 'text/typescript' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.data.testCase.filePath}.spec.ts`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
