import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logout-container">
      <div class="logout-card">
        <i class="fas fa-sign-out-alt logout-icon"></i>
        <h2>Sign Out</h2>
        <p>Are you sure you want to sign out of your account?</p>
        <div class="logout-actions">
          <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
          <button class="btn btn-danger" (click)="confirmLogout()">Sign Out</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logout-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 2rem;
    }
    .logout-card {
      background: var(--bg-secondary, #1e1e2e);
      border: 1px solid var(--border-color, #2d2d3d);
      border-radius: 12px;
      padding: 3rem 2.5rem;
      text-align: center;
      max-width: 420px;
      width: 100%;
    }
    .logout-icon {
      font-size: 3rem;
      color: var(--color-danger, #ef4444);
      margin-bottom: 1rem;
    }
    h2 {
      color: var(--text-primary, #fff);
      margin: 0 0 0.5rem;
    }
    p {
      color: var(--text-secondary, #a0a0b0);
      margin: 0 0 2rem;
    }
    .logout-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn {
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .btn-secondary {
      background: var(--bg-tertiary, #2d2d3d);
      color: var(--text-primary, #fff);
    }
    .btn-secondary:hover {
      opacity: 0.85;
    }
    .btn-danger {
      background: var(--color-danger, #ef4444);
      color: #fff;
    }
    .btn-danger:hover {
      opacity: 0.85;
    }
  `]
})
export class LogoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // If user navigated here directly and is not authenticated, redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
  }

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
