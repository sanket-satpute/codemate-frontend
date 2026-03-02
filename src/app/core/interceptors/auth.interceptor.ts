import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

/**
 * HTTP interceptor that:
 * 1. Attaches JWT token as Bearer auth header to all outgoing requests
 * 2. Catches 401 responses and auto-redirects to login OR shows a re-login modal
 * 3. Skips token for auth endpoints (login/register) to avoid circular dependencies
 */
export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const isAuthRequest = request.url.includes('/auth/login') || request.url.includes('/auth/register');

  if (!isAuthRequest) {
    const authToken = authService.getJwt();

    if (authToken && typeof authToken === 'string' && authToken.length > 0) {
      request = addTokenHeader(request, authToken);
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequest) {
        if (authService.isTokenExpired() && authService.currentUser()) {
          // Token is expired but we have a user session: show re-login modal
          return handle401Error(request, next, authService);
        } else {
          // No token or completely invalid token, regular logout
          console.warn('AuthInterceptor: 401 Unauthorized — logging out');
          authService.logout();
        }
      }

      if (error.status === 403) {
        console.warn('AuthInterceptor: 403 Forbidden — insufficient permissions');
      }

      return throwError(() => error);
    })
  );
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    // Trigger the re-login modal
    authService.showReloginModal.set(true);
  }

  // Wait for the auth state to change (either success or cancel)
  return authService.authStateChanged$.pipe(
    take(1),
    switchMap(isAuthenticated => {
      isRefreshing = false;
      if (isAuthenticated) {
        // User successfully logged back in
        const newAuthToken = authService.getJwt();
        return next(addTokenHeader(request, newAuthToken as string));
      } else {
        // User cancelled re-login
        return throwError(() => new Error('Re-login cancelled by user'));
      }
    })
  );
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
