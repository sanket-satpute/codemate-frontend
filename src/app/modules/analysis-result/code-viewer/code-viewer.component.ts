import { Component, Input, OnChanges, SimpleChanges, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisResultService } from '../analysis-result.service';
import { Issue } from '../analysis-result.model';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { CodeHighlighterPipe } from '../../../shared/pipes/code-highlighter.pipe';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule, LoaderComponent, CodeHighlighterPipe],
  templateUrl: './code-viewer.component.html',
  styleUrls: ['./code-viewer.component.scss']
})
export class CodeViewerComponent implements OnChanges {
  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) filePath!: string;
  @Input({ required: true }) issue!: Issue;

  fileContent: WritableSignal<string | null> = signal(null);
  loading = signal(true);

  constructor(private analysisResultService: AnalysisResultService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filePath'] || changes['issue']) {
      this.loadFileContent();
    }
  }

  loadFileContent(): void {
    this.loading.set(true);
    this.analysisResultService.getFileContent(this.projectId, this.filePath).subscribe({
      next: (data) => {
        this.fileContent.set(data.content);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load file content', err);
        this.loading.set(false);
      }
    });
  }

  highlightedLines(): { content: string, isHighlighted: boolean }[] {
    const content = this.fileContent();
    if (!content) return [];
    
    return content.split('\\n').map((line, index) => ({
      content: line,
      isHighlighted: (index + 1) === this.issue.line
    }));
  }
}
