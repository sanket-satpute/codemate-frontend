import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileWithIssues } from '../analysis-result.model';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTreeComponent {
  @Input({ required: true }) files!: FileWithIssues[];
  @Output() fileSelected = new EventEmitter<FileWithIssues>();

  selectedFilePath: WritableSignal<string | null> = signal(null);

  selectFile(file: FileWithIssues): void {
    this.selectedFilePath.set(file.path);
    this.fileSelected.emit(file);
  }
}
