import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router'; // RouterOutlet is for app.html's <router-outlet>
import { AuthService } from './core/services/auth.service';
import { LocalStorageService } from './core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Removed LayoutComponent from here
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'codescope-frontend';
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  ngOnInit(): void {
    // Attempt to restore authentication state from local storage on app initialization
    this.authService.restoreFromLocalStorage();

    // Check if onboarding is completed
    const hasCompletedOnboarding = this.localStorageService.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      this.router.navigate(['/onboarding']);
    }
  }
}
