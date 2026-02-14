import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserProfile } from '../../../core/models/auth.model';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoaderComponent],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input() currentUser!: User;
  @Output() profileUpdated = new EventEmitter<UserProfile>();

  profileForm!: FormGroup;
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  saving = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      // role: [{ value: this.currentUser?.roles[0] || '', disabled: true }], // Assuming single role and read-only
      profilePicture: [null]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Basic file type validation (e.g., images)
      if (!file.type.startsWith('image/')) {
        this.profileForm.get('profilePicture')?.setErrors({ invalidFileType: true });
        this.error.set('Only image files are allowed.');
        return;
      }
      this.profileForm.patchValue({ profilePicture: file });
      this.error.set(null);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const { name, email, profilePicture } = this.profileForm.value;
    const userProfile: UserProfile = { name, email };

    // Handle profile picture upload separately if needed, or integrate into updateProfile
    // For simplicity, this example assumes updateProfile can handle direct file or URL.
    // A more robust solution would involve a dedicated file upload service.

    this.settingsService.updateProfile(userProfile).subscribe({
      next: (updatedUser) => {
        this.profileUpdated.emit(updatedUser);
        this.saving.set(false);
        // Optionally show a success toast
      },
      error: (err) => {
        this.error.set('Failed to update profile. Please try again.');
        this.saving.set(false);
        console.error('Profile update error:', err);
      }
    });
  }
}
