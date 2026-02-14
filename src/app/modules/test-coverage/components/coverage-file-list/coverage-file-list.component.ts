import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverageFile } from '../../test-coverage.model';

@Component({
  selector: 'app-coverage-file-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coverage-file-list.component.html',
  styleUrls: ['./coverage-file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoverageFileListComponent {
  @Input() files: CoverageFile[] = [];
  @Output() generateTests = new EventEmitter<CoverageFile>();

  onGenerateTests(file: CoverageFile): void {
    this.generateTests.emit(file);
  }
}
