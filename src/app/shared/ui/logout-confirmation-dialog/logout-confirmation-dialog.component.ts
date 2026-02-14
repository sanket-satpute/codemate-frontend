import { Component, EventEmitter, Output, Input, OnDestroy, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { FocusTrapFactory } from '@angular/cdk/a11y';

@Component({
  selector: 'app-logout-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrls: ['./logout-confirmation-dialog.component.scss']
})
export class LogoutConfirmationDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Output() closeDialog = new EventEmitter<void>();

  @ViewChild('dialogPanel') dialogPanel!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  @ViewChild('confirmButton') confirmButton!: ElementRef;

  private focusTrap: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private elementRef: ElementRef,
    private focusTrapFactory: FocusTrapFactory
  ) {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.analyticsService.trackEvent('logout_dialog_opened');
      this.trapFocus();
    }
  }

  ngOnDestroy(): void {
    this.releaseFocusTrap();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.analyticsService.trackEvent('logout_dialog_opened');
      this.trapFocus();
    } else {
      this.releaseFocusTrap();
    }
  }

  private trapFocus(): void {
    if (this.dialogPanel && !this.focusTrap) {
      this.focusTrap = this.focusTrapFactory.create(this.dialogPanel.nativeElement);
      this.focusTrap.attach();
      // Focus the cancel button by default for accessibility
      this.cancelButton?.nativeElement.focus();
    }
  }

  private releaseFocusTrap(): void {
    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = null;
    }
  }

  onCancel(): void {
    this.analyticsService.trackEvent('logout_canceled');
    this.closeDialog.emit();
  }

  onConfirmLogout(): void {
    this.analyticsService.trackEvent('logout_confirmed');
    this.authService.logout(); // Assuming this handles token clearing and navigation to login
    this.closeDialog.emit();
  }

  // Close dialog on backdrop click
  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.elementRef.nativeElement.querySelector('.logout-dialog-overlay')) {
      this.onCancel();
    }
  }

  // Keyboard accessibility
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isOpen) {
      event.preventDefault();
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event): void {
    if (this.isOpen && this.confirmButton && document.activeElement === this.confirmButton.nativeElement) {
      event.preventDefault();
      this.onConfirmLogout();
    } else if (this.isOpen && this.cancelButton && document.activeElement === this.cancelButton.nativeElement) {
      event.preventDefault();
      this.onCancel();
    }
  }
}
