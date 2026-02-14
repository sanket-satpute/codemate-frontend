import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'info' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonShape = 'square' | 'rounded' | 'circle';

export type ButtonHtmlType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() shape: ButtonShape = 'rounded';
  @Input() type: ButtonHtmlType = 'button';

  // Backward compatibility for old 'type' property (can be HTML type or variant)
  @Input('type') set oldTypeProperty(value: string) {
    if (['button', 'submit', 'reset'].includes(value)) {
      this.type = value as ButtonHtmlType;
    } else {
      this.variant = value as ButtonVariant;
    }
  }

  // Backward compatibility for old 'size' property
  @Input('size') set oldSizeProperty(value: string) {
    switch (value) {
      case 'small': this.size = 'sm'; break;
      case 'medium': this.size = 'md'; break;
      case 'large': this.size = 'lg'; break;
      default: this.size = value as ButtonSize;
    }
  }
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon: string | null = null;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth = false;
  @Input() loadingText = 'Loading...';
  @Input() ariaLabel = '';
  @Input() tabIndex: number | null = null;

  @Output() btnClick = new EventEmitter<Event>();

  @HostBinding('attr.aria-label')
  get ariaLabelBinding(): string | null {
    return this.ariaLabel || null;
  }

  @HostBinding('attr.tabindex')
  get tabIndexBinding(): number | null {
    return this.tabIndex !== null ? this.tabIndex : null;
  }

  @HostBinding('class')
  get hostClasses(): string {
    return this.buttonClasses.join(' ');
  }

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }

  get hasOnlyIcon(): boolean {
    return !this.label && !!this.icon;
  }

  get displayText(): string {
    return this.loading ? this.loadingText : this.label;
  }

  get buttonClasses(): string[] {
    const classes = ['btn'];

    // Base classes
    classes.push(`btn-${this.size}`, `btn-${this.shape}`);

    // Variant classes
    if (this.variant === 'outline') {
      classes.push('btn-outline');
    } else if (this.variant === 'ghost') {
      classes.push('btn-ghost');
    } else if (this.variant === 'link') {
      classes.push('btn-link');
    } else {
      classes.push(`btn-${this.variant}`);
    }

    // State classes
    if (this.disabled || this.loading) {
      classes.push('btn-disabled');
    }

    if (this.loading) {
      classes.push('btn-loading');
    }

    if (this.fullWidth) {
      classes.push('btn-full-width');
    }

    if (this.hasOnlyIcon) {
      classes.push('btn-icon-only');
    }

    return classes.filter(Boolean);
  }
}
