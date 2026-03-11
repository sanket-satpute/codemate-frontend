import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { ToastService } from '../../../core/services/toast';
import { ThemeService, ThemePreference } from '../../../core/services/theme/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile, PasswordChangeDTO, ChangeEmailDTO, DisableAccountDTO, DeleteAccountDTO } from '../../../core/models/auth.model';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface Profile {
  name: string;
  email: string;
  role: string;
  initials: string;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  activeSection = 'profile';
  loadingProfile = true;
  savingProfile = false;

  // Password form
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  changingPassword = false;

  // Touched tracking
  passwordTouched: Record<string, boolean> = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  // Per-field error getters
  get currentPasswordError(): string {
    if (!this.passwordTouched['currentPassword']) return '';
    if (!this.currentPassword.trim()) return 'Current password is required';
    return '';
  }

  get newPasswordError(): string {
    if (!this.passwordTouched['newPassword']) return '';
    if (!this.newPassword.trim()) return 'New password is required';
    if (this.newPassword.length < 8) return 'Password must be at least 8 characters';
    return '';
  }

  get confirmPasswordError(): string {
    if (!this.passwordTouched['confirmPassword']) return '';
    if (!this.confirmPassword.trim()) return 'Please confirm your new password';
    if (this.newPassword !== this.confirmPassword) return 'Passwords do not match';
    return '';
  }

  get isPasswordFormValid(): boolean {
    return (
      !!this.currentPassword.trim() &&
      !!this.newPassword.trim() &&
      this.newPassword.length >= 8 &&
      this.newPassword === this.confirmPassword
    );
  }

  markPasswordTouched(field: string): void {
    this.passwordTouched[field] = true;
  }

  sidebarItems: SidebarItem[] = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
    { id: 'account-security', label: 'Account & Security', icon: 'fas fa-shield-alt' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
    { id: 'danger-zone', label: 'Reset & Account', icon: 'fas fa-shield-alt' },
  ];

  profile: Profile = { name: '', email: '', role: '', initials: '' };
  selectedTheme: ThemePreference = 'system';

  // Profile field touched tracking
  profileTouched: Record<string, boolean> = { name: false };

  // Profile validation getters (name only — email changed via dialog)
  get nameError(): string {
    if (!this.profileTouched['name']) return '';
    if (!this.profile.name.trim()) return 'Name is required';
    if (this.profile.name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  }

  get isProfileValid(): boolean {
    return !!this.profile.name.trim() && this.profile.name.trim().length >= 2;
  }

  // ─── Change Email Dialog ────────────────────────────────────
  showEmailDialog = false;
  emailDialogPassword = '';
  emailDialogNewEmail = '';
  emailDialogConfirmEmail = '';
  changingEmail = false;
  emailDialogTouched: Record<string, boolean> = { password: false, newEmail: false, confirmEmail: false };

  get emailDialogPasswordError(): string {
    if (!this.emailDialogTouched['password']) return '';
    if (!this.emailDialogPassword.trim()) return 'Current password is required';
    return '';
  }

  get emailDialogNewEmailError(): string {
    if (!this.emailDialogTouched['newEmail']) return '';
    if (!this.emailDialogNewEmail.trim()) return 'New email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.emailDialogNewEmail.trim())) return 'Please enter a valid email address';
    if (this.emailDialogNewEmail.trim().toLowerCase() === this.profile.email.toLowerCase())
      return 'New email must be different from current email';
    return '';
  }

  get emailDialogConfirmError(): string {
    if (!this.emailDialogTouched['confirmEmail']) return '';
    if (!this.emailDialogConfirmEmail.trim()) return 'Please confirm your new email';
    if (this.emailDialogNewEmail.trim().toLowerCase() !== this.emailDialogConfirmEmail.trim().toLowerCase())
      return 'Emails do not match';
    return '';
  }

  get isEmailDialogValid(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !!this.emailDialogPassword.trim() &&
      !!this.emailDialogNewEmail.trim() &&
      emailRegex.test(this.emailDialogNewEmail.trim()) &&
      this.emailDialogNewEmail.trim().toLowerCase() !== this.profile.email.toLowerCase() &&
      this.emailDialogNewEmail.trim().toLowerCase() === this.emailDialogConfirmEmail.trim().toLowerCase();
  }

  openEmailDialog(): void {
    this.emailDialogPassword = '';
    this.emailDialogNewEmail = '';
    this.emailDialogConfirmEmail = '';
    this.emailDialogTouched = { password: false, newEmail: false, confirmEmail: false };
    this.changingEmail = false;
    this.showEmailDialog = true;
  }

  closeEmailDialog(): void {
    this.showEmailDialog = false;
  }

  submitEmailChange(): void {
    this.emailDialogTouched['password'] = true;
    this.emailDialogTouched['newEmail'] = true;
    this.emailDialogTouched['confirmEmail'] = true;

    if (!this.isEmailDialogValid) {
      return;
    }

    this.changingEmail = true;
    const data: ChangeEmailDTO = {
      currentPassword: this.emailDialogPassword,
      newEmail: this.emailDialogNewEmail.trim(),
      confirmNewEmail: this.emailDialogConfirmEmail.trim(),
    };
    this.settingsService.changeEmail(data).subscribe({
      next: (user) => {
        this.profile.email = user.email || '';
        // Propagate to auth service so navbar, profile dropdown update
        this.authService.setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        this.changingEmail = false;
        this.showEmailDialog = false;
        this.toastService.showSuccess('Email changed successfully');
      },
      error: () => {
        this.changingEmail = false;
        // Error toast handled by global errorInterceptor
      },
    });
  }

  // Disable account form
  disableDays = 7;
  disablePassword = '';
  disablingAccount = false;
  disablePasswordTouched = false;

  // Delete account form
  deletePassword = '';
  deleteConfirmText = '';
  deletingAccount = false;
  deletePasswordTouched = false;
  deleteConfirmTouched = false;

  ngOnInit() {
    this.activeSection = 'profile';
    this.selectedTheme = this.themeService.themePreference();
    this.loadProfile();
  }

  applyTheme(preference: ThemePreference): void {
    this.selectedTheme = preference;
    this.themeService.setTheme(preference);
  }

  private loadProfile(): void {
    this.loadingProfile = true;
    this.settingsService.getCurrentUser().subscribe({
      next: (user) => {
        this.profile = {
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'User',
          initials: this.getInitials(user.name || ''),
        };
        this.loadingProfile = false;
      },
      error: () => {
        this.loadingProfile = false;
      },
    });
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '?';
  }

  selectSection(id: string) { this.activeSection = id; }

  saveProfile(): void {
    this.profileTouched['name'] = true;

    if (!this.isProfileValid) {
      this.toastService.showWarning('Name must be at least 2 characters');
      return;
    }

    this.savingProfile = true;
    const profileData: UserProfile = {
      name: this.profile.name.trim(),
      email: this.profile.email, // send current email unchanged
    };
    this.settingsService.updateProfile(profileData).subscribe({
      next: (user) => {
        this.profile = {
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'User',
          initials: this.getInitials(user.name || ''),
        };
        // Propagate updated user to AuthService so navbar, profile dropdown, etc. update
        this.authService.setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        this.savingProfile = false;
        this.profileTouched = { name: false };
        this.toastService.showSuccess('Profile saved successfully');
      },
      error: () => {
        this.savingProfile = false;
      },
    });
  }

  changePassword(): void {
    // Mark all fields as touched to trigger inline errors
    this.passwordTouched['currentPassword'] = true;
    this.passwordTouched['newPassword'] = true;
    this.passwordTouched['confirmPassword'] = true;

    if (!this.isPasswordFormValid) {
      // Show first relevant error as toast too
      if (!this.currentPassword.trim() || !this.newPassword.trim() || !this.confirmPassword.trim()) {
        this.toastService.showWarning('Please fill in all password fields');
      } else if (this.newPassword.length < 8) {
        this.toastService.showWarning('Password must be at least 8 characters');
      } else if (this.newPassword !== this.confirmPassword) {
        this.toastService.showError('New passwords do not match');
      }
      return;
    }

    this.changingPassword = true;
    const data: PasswordChangeDTO = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword,
    };
    this.settingsService.changePassword(data).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.changingPassword = false;
        this.passwordTouched = { currentPassword: false, newPassword: false, confirmPassword: false };
        this.toastService.showSuccess('Password changed successfully');
      },
      error: () => {
        this.changingPassword = false;
        // Error toast handled by global errorInterceptor
      },
    });
  }

  openDeleteModal(title: string, message: string, action: () => void) { }
  confirmDelete() { }
  cancelDelete() { }

  // ─── Disable account error getters ─────────────────────────────
  get disablePasswordError(): string {
    if (!this.disablePasswordTouched) return '';
    if (!this.disablePassword.trim()) return 'Password is required to disable your account';
    return '';
  }

  // ─── Delete account error getters ──────────────────────────────
  get deletePasswordError(): string {
    if (!this.deletePasswordTouched) return '';
    if (!this.deletePassword.trim()) return 'Password is required';
    return '';
  }

  get deleteConfirmError(): string {
    if (!this.deleteConfirmTouched) return '';
    if (this.deleteConfirmText !== 'DELETE MY ACCOUNT') return 'Please type DELETE MY ACCOUNT exactly';
    return '';
  }

  // ─── Reset Theme ───────────────────────────────────────────────
  resetTheme(): void {
    this.applyTheme('system');
    this.toastService.showSuccess('Theme reset to system default');
  }

  // ─── Disable Account ──────────────────────────────────────────
  disableAccount(): void {
    this.disablePasswordTouched = true;
    if (!this.disablePassword.trim()) {
      this.toastService.showWarning('Please enter your password');
      return;
    }

    this.disablingAccount = true;
    const data: DisableAccountDTO = {
      days: this.disableDays,
      password: this.disablePassword,
    };
    this.settingsService.disableAccount(data).subscribe({
      next: () => {
        this.disablingAccount = false;
        this.toastService.showSuccess(`Account disabled for ${this.disableDays} days. Logging out...`);
        // Log the user out after a short delay so they see the toast
        setTimeout(() => {
          this.authService.logout();
        }, 2000);
      },
      error: () => {
        this.disablingAccount = false;
      },
    });
  }

  // ─── Delete Account Permanently ───────────────────────────────
  deleteAccountPermanently(): void {
    this.deletePasswordTouched = true;
    this.deleteConfirmTouched = true;

    if (!this.deletePassword.trim()) {
      this.toastService.showWarning('Please enter your password');
      return;
    }
    if (this.deleteConfirmText !== 'DELETE MY ACCOUNT') {
      this.toastService.showWarning('Please type DELETE MY ACCOUNT to confirm');
      return;
    }

    this.deletingAccount = true;
    const data: DeleteAccountDTO = {
      password: this.deletePassword,
    };
    this.settingsService.deleteAccount(data).subscribe({
      next: () => {
        this.deletingAccount = false;
        this.toastService.showSuccess('Account permanently deleted. Redirecting...');
        setTimeout(() => {
          this.authService.logout();
        }, 2000);
      },
      error: () => {
        this.deletingAccount = false;
      },
    });
  }
}
