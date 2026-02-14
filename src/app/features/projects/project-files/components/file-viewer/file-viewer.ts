import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileContentResponse } from '../../models/file-content-response.model';
import hljs from 'highlight.js';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-viewer.html',
  styleUrl: './file-viewer.css',
})
export class FileViewerComponent implements OnChanges, AfterViewInit {
  @Input() fileContent: FileContentResponse | null = null;
  @ViewChild('codeContainer') codeContainer!: ElementRef;

  wordWrap = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileContent'] && this.fileContent) {
      this.highlightCode();
    }
  }

  ngAfterViewInit(): void {
    this.highlightCode();
  }

  highlightCode(): void {
    if (this.fileContent && this.codeContainer) {
      const preEl = this.codeContainer.nativeElement.querySelector('pre');
      const codeEl = preEl.querySelector('code');
      codeEl.textContent = this.fileContent.content;
      hljs.highlightElement(codeEl);
    }
  }

  toggleWordWrap(): void {
    this.wordWrap.set(!this.wordWrap());
  }

  copyCode(): void {
    if (this.fileContent) {
      navigator.clipboard.writeText(this.fileContent.content);
    }
  }
}
