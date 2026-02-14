import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  @Input() highlight: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.highlight) {
      // In a real application, you would integrate a library like Prism.js or Highlight.js here for actual syntax highlighting.
      // For now, we're just setting the text content, and CSS will handle the styling.
      this.renderer.setProperty(this.el.nativeElement, 'textContent', this.highlight);
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', '');
    }
  }
}
