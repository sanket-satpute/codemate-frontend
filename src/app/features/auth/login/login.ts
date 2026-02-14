// path: src/app/features/auth/login/login.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginRequest: LoginRequest = { email: '', password: '' };
  errorMessage = '';
  isLoading = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  // Removed redundant empty constructor

  onSubmit(): void {
    this.isLoading = true;
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        if (response) {
          // AuthService now handles token storage in localStorage, so no need to set it here.
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: (error: { message: string; }) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}
