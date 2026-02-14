import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../app/core/services/auth.service';
import { ButtonComponent } from '../../../../app/shared/ui/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onRegister(): void {
    this.errorMessage.set(null);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { name, email, password } = this.registerForm.getRawValue();

    if (name && email && password) {
      const registerRequest = { name, email, password };
      this.authService.register(registerRequest).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/auth/login'], { queryParams: { registered: true } });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.message || 'Registration failed. Please try again.');
        }
      });
    }
  }
}
