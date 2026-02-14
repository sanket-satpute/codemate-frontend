import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoaderComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  saving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    const { currentPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;

    this.settingsService.changePassword({ currentPassword, newPassword, confirmNewPassword }).subscribe({
      next: () => {
        this.success.set('Password changed successfully!');
        this.saving.set(false);
        this.changePasswordForm.reset();
      },
      error: (err) => {
        this.error.set('Failed to change password. Please try again.');
        this.saving.set(false);
        console.error('Password change error:', err);
      }
    });
  }
}
