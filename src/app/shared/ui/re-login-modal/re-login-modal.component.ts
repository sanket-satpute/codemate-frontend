import { Component, EventEmitter, Output, Input, OnDestroy, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FocusTrapFactory } from '@angular/cdk/a11y';

@Component({
    selector: 'app-re-login-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './re-login-modal.component.html',
    styleUrls: ['./re-login-modal.component.scss']
})
export class ReLoginModalComponent implements OnInit, OnDestroy {
    @Input() isOpen: boolean = false;
    @Input() email: string = '';
    @Output() closeDialog = new EventEmitter<void>();

    @ViewChild('dialogPanel') dialogPanel!: ElementRef;
    @ViewChild('passwordInput') passwordInput!: ElementRef;

    password = '';
    isLoggingIn = false;
    errorMessage = '';

    private focusTrap: any;

    constructor(
        private authService: AuthService,
        private elementRef: ElementRef,
        private focusTrapFactory: FocusTrapFactory
    ) { }

    ngOnInit(): void {
        if (this.isOpen) {
            this.trapFocus();
        }
    }

    ngOnDestroy(): void {
        this.releaseFocusTrap();
    }

    ngOnChanges(): void {
        if (this.isOpen) {
            this.trapFocus();
            // Try to focus the password field automatically
            setTimeout(() => {
                if (this.passwordInput) {
                    this.passwordInput.nativeElement.focus();
                }
            }, 50);
        } else {
            this.releaseFocusTrap();
        }
    }

    private trapFocus(): void {
        if (this.dialogPanel && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.dialogPanel.nativeElement);
            this.focusTrap.attach();
        }
    }

    private releaseFocusTrap(): void {
        if (this.focusTrap) {
            this.focusTrap.destroy();
            this.focusTrap = null;
        }
    }

    onCancel(): void {
        this.authService.logout();
        this.closeDialog.emit();
    }

    onLogin(): void {
        if (!this.password) return;

        this.isLoggingIn = true;
        this.errorMessage = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.isLoggingIn = false;
                this.password = '';
                this.closeDialog.emit();
            },
            error: (err) => {
                this.isLoggingIn = false;
                this.errorMessage = 'Incorrect password. Please try again.';
            }
        });
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
        if (this.isOpen && this.password) {
            event.preventDefault();
            this.onLogin();
        }
    }
}
