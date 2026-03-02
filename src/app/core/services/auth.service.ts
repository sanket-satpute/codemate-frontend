import { Injectable, signal, inject, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthResponse, User, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { jwtDecode } from 'jwt-decode';
import { WebSocketService } from './websocket/websocket.service';

const AUTH_TOKEN_KEY = 'jwt_token';
const CURRENT_USER_KEY = 'current_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for authentication state
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);
  showReloginModal = signal<boolean>(false);
  authStateChanged$ = new Subject<boolean>();

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private injector = inject(Injector);

  constructor() {
    this.restoreFromLocalStorage();
  }

  /**
   * Sets the JWT token in the store and local storage.
   * @param token The JWT token string.
   */
  setToken(token: string): void {
    this.token.set(token);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    this.isAuthenticated.set(true);
    this.authStateChanged$.next(true);
  }

  /**
   * Clears the JWT token from the store and local storage.
   */
  clearToken(): void {
    this.token.set(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.authStateChanged$.next(false);
  }

  /**
   * Sets the current user in the store and local storage.
   * @param user The User object.
   */
  setUser(user: User | null): void {
    this.currentUser.set(user);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  /**
   * Restores authentication state from local storage on service initialization.
   */
  restoreFromLocalStorage(): void {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (storedToken) {
      this.token.set(storedToken);
      this.isAuthenticated.set(true);
    }

    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        this.clearAuthData();
      }
    }

    // If token exists but user doesn't, we will not attempt to fetch the user
    // immediately during service initialization to avoid potential race conditions
    // with HTTP interceptors. Instead, user data should be fetched
    // via a guard, resolver, or when explicitly requested after app bootstrap.
  }

  /**
   * Clears all authentication-related data.
   */
  private clearAuthData(): void {
    this.clearToken();
    this.setUser(null);
  }

  /**
   * Retrieves the JWT token from local storage.
   * @returns The JWT token string or null if not found.
   */
  getJwt(): string | null {
    // Return the token from the signal, or try localStorage as a fallback
    // This ensures that even if the signal hasn't fully propagated,
    // the latest token from storage is used, especially during initial app load
    const currentToken = this.token();
    if (currentToken) {
      return currentToken;
    }
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      this.token.set(storedToken); // Update the signal if found in localStorage
    }
    return storedToken;
  }

  /**
   * Checks if the stored JWT token is expired.
   * @returns true if expired or invalid, false otherwise.
   */
  isTokenExpired(): boolean {
    const currentToken = this.getJwt();
    if (!currentToken) return true;

    try {
      const decoded: any = jwtDecode(currentToken);
      if (!decoded || !decoded.exp) return true;

      // decoded.exp is in seconds, convert to milliseconds
      return (decoded.exp * 1000) < Date.now();
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  }

  /**
   * Handles HTTP errors from the backend.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that emits an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend errors
      if (error.status === 401) {
        errorMessage = 'Unauthorized: Invalid credentials or session expired.';
        // We no longer automatically logout here. The AuthInterceptor handles
        // token expiration gracefully by showing a relogin modal.
      } else if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = `Backend error: ${error.error.message}`;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Sends a login request to the backend.
   * @param email User's email.
   * @param password User's password.
   * @returns An Observable of AuthResponse.
   */
  /**
   * Sends a login request with user credentials to the backend.
   * @param credentials The LoginRequest object containing email and password.
   * @returns An Observable of AuthResponse.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}${ApiEndpoints.AUTH.LOGIN}`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
      }),
      // Use switchMap instead of nested subscribe to properly chain user fetch
      switchMap(response =>
        this.getCurrentUser().pipe(
          // Map back to the original AuthResponse so downstream consumers get the expected type
          tap(user => this.setUser(user)),
          switchMap(() => [response])
        )
      ),
      // Connect WebSocket after successful login
      tap(() => this.connectWebSocket()),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Sends a registration request to the backend.
   * @param name User's name.
   * @param email User's email.
   * @param password User's password.
   * @returns An Observable of AuthResponse.
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}${ApiEndpoints.AUTH.REGISTER}`, request).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Fetches the current user's details from the backend.
   * @returns An Observable of User.
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${ApiEndpoints.AUTH.ME}`).pipe(
      tap(user => this.setUser(user)),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Logs out the current user, clears session data, and redirects to login.
   */
  logout(): void {
    this.disconnectWebSocket();
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Lazily connect WebSocket after authentication.
   * Uses Injector to avoid circular dependency with WebSocketService.
   */
  private connectWebSocket(): void {
    try {
      const wsService = this.injector.get(WebSocketService);
      wsService.connect();
    } catch (e) {
      console.warn('WebSocket connection skipped:', e);
    }
  }

  /**
   * Disconnect WebSocket on logout.
   */
  private disconnectWebSocket(): void {
    try {
      const wsService = this.injector.get(WebSocketService);
      wsService.close();
    } catch (e) {
      // Silently handle — WS may not have been connected
    }
  }
}
