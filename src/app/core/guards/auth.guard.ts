import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is authenticated using the signal
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect to the login page if not authenticated
    return router.createUrlTree(['/auth/login']);
  }
};
