import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Import AuthService

export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService); // Inject AuthService
  const authToken = authService.getJwt(); // Retrieve token from AuthService

  // Clone the request and add the authorization header if a valid token string exists
  // Ensure authToken is not null, undefined, or an empty string
  if (authToken && typeof authToken === 'string' && authToken.length > 0) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(request); // Call next directly
}
