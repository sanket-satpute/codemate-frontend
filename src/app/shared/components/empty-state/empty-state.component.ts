import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer and SafeHtml

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() iconClass: string = 'fas fa-box-open'; // Default Font Awesome icon
  @Input() svgContent: string | SafeHtml = ''; // New input for custom SVG content, now accepts SafeHtml
  @Input() title: string = 'No Data Available';
  @Input() message: string = 'It looks like there\'s nothing here yet. Start by adding some data or creating a new item.';
  @Input() ctaText: string = 'Get Started';
  @Input() ctaLink: string = '/'; // Default link to home
  @Input() showCta: boolean = true;

  constructor(private sanitizer: DomSanitizer) {} // Inject DomSanitizer here, though it's not directly used for sanitization *within* this component for the svgContent input. It is needed for SafeHtml type to resolve correctly.

  get showSvgIcon(): boolean {
    return !!this.svgContent;
  }
}
