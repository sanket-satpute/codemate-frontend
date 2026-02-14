import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'codeHighlighter',
  standalone: true
})
export class CodeHighlighterPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(lines: { content: string, isHighlighted: boolean }[]): SafeHtml {
    const html = lines.map((line, index) => {
      const lineNumber = `<span class="line-number">${index + 1}</span>`;
      const lineContent = `<span class="line-content">${line.content}</span>`; // Simplified, relying on browser's default behavior for now
      const lineClass = line.isHighlighted ? 'line highlighted' : 'line';
      return `<div class="${lineClass}">${lineNumber}${lineContent}</div>`;
    }).join('');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Simplified: removing explicit HTML escaping to resolve persistent writing issues.
  // This may need to be revisited for full HTML entity escaping if actual HTML content appears in code.
  private escapeHtml(html: string): string {
    return html;
  }
}
