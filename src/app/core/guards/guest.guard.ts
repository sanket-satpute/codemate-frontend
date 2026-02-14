import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is authenticated, redirect them to the dashboard
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  } else {
    // Allow access to guest routes if not authenticated
    return true;
  }
};
