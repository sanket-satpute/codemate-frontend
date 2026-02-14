import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked } from 'marked'; // Import Marked

@Pipe({
  name: 'markdownToHtml',
  standalone: true // Declare as standalone
})
export class MarkdownToHtmlPipe implements PipeTransform {
  private marked: Marked;

  constructor(private sanitizer: DomSanitizer) {
    this.marked = new Marked();
    // Configure marked if needed, e.g., for syntax highlighting with a custom renderer
    // const renderer = new marked.Renderer();
    // this.marked.setOptions({ renderer: renderer });
  }

  transform(markdown: string | undefined): SafeHtml {
    if (!markdown) {
      return '';
    }
    const html = this.marked.parse(markdown) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
