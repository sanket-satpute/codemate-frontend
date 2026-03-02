import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  // Convenience getter for easy access to form fields in HTML
  get f() {
    return this.loginForm.controls;
  }

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  /** Toggle password field between text and password */
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onLogin(): void {
    this.errorMessage.set(null);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email, password, rememberMe } = this.loginForm.getRawValue();

    if (email && password) {
      const credentials = { email, password };

      this.authService.login(credentials).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Persist token based on rememberMe preference
          if (!rememberMe) {
            // If "remember me" is unchecked, move token from localStorage to sessionStorage
            // so it expires when the browser tab closes
            const token = localStorage.getItem('jwt_token');
            if (token) {
              sessionStorage.setItem('jwt_token', token);
              localStorage.removeItem('jwt_token');
            }
          }
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.message || 'Login failed. Please try again.');

          // Auto-dismiss error after 8 seconds (#9)
          setTimeout(() => {
            this.errorMessage.set(null);
          }, 8000);
        }
      });
    }
  }
}
