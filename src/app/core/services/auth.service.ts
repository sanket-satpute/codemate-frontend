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
const REMEMBER_ME_KEY = 'remember_me';

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
    this.restoreSession();
  }

  // ─── Storage helpers ───────────────────────────────────────────────
  // When "Remember Me" is ON  → persist in localStorage  (survives browser close)
  // When "Remember Me" is OFF → persist in sessionStorage (cleared on browser close)
  // On restore we check BOTH storages, preferring localStorage.

  /**
   * Returns the active storage backend based on the rememberMe preference.
   */
  private getStorage(): Storage {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'false'
      ? sessionStorage
      : localStorage;
  }

  /**
   * Reads a key from whichever storage currently holds it.
   * Prefers localStorage, falls back to sessionStorage.
   */
  private readFromAnyStorage(key: string): string | null {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  }

  /**
   * Writes a key/value to the active storage and removes it from the other.
   */
  private writeToStorage(key: string, value: string): void {
    const active = this.getStorage();
    const inactive = active === localStorage ? sessionStorage : localStorage;
    active.setItem(key, value);
    inactive.removeItem(key); // keep only one copy
  }

  /**
   * Removes a key from BOTH storages.
   */
  private removeFromAllStorage(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  // ─── Public API ────────────────────────────────────────────────────

  /**
   * Persists the "Remember Me" preference. Must be called BEFORE setToken/setUser
   * so the correct storage backend is chosen.
   */
  setRememberMe(remember: boolean): void {
    // The flag itself always lives in localStorage so restoreSession can read it
    if (remember) {
      localStorage.removeItem(REMEMBER_ME_KEY); // default = remember
    } else {
      localStorage.setItem(REMEMBER_ME_KEY, 'false');
    }
  }

  /**
   * Sets the JWT token in the signal and the active storage.
   */
  setToken(token: string): void {
    this.token.set(token);
    this.writeToStorage(AUTH_TOKEN_KEY, token);
    this.isAuthenticated.set(true);
    this.authStateChanged$.next(true);
  }

  /**
   * Clears the JWT token from every location.
   */
  clearToken(): void {
    this.token.set(null);
    this.removeFromAllStorage(AUTH_TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.authStateChanged$.next(false);
  }

  /**
   * Sets the current user in the signal and the active storage.
   */
  setUser(user: User | null): void {
    this.currentUser.set(user);
    if (user) {
      this.writeToStorage(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      this.removeFromAllStorage(CURRENT_USER_KEY);
    }
  }

  /**
   * Restores authentication state from storage on service initialization.
   * Checks both localStorage and sessionStorage so sessions survive
   * page reloads, HMR, and (when "Remember Me" is on) browser restarts.
   */
  restoreSession(): void {
    const storedToken = this.readFromAnyStorage(AUTH_TOKEN_KEY);
    const storedUser = this.readFromAnyStorage(CURRENT_USER_KEY);

    if (storedToken) {
      this.token.set(storedToken);
      this.isAuthenticated.set(true);
    }

    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch {
        this.clearAuthData();
      }
    }
  }

  /**
   * Retrieves the JWT token — signal first, then falls back to storage.
   */
  getJwt(): string | null {
    const currentToken = this.token();
    if (currentToken) {
      return currentToken;
    }
    const storedToken = this.readFromAnyStorage(AUTH_TOKEN_KEY);
    if (storedToken) {
      this.token.set(storedToken);
    }
    return storedToken;
  }

  /**
   * Checks if the stored JWT token is expired.
   */
  isTokenExpired(): boolean {
    const currentToken = this.getJwt();
    if (!currentToken) return true;

    try {
      const decoded: any = jwtDecode(currentToken);
      if (!decoded || !decoded.exp) return true;
      return (decoded.exp * 1000) < Date.now();
    } catch {
      return true;
    }
  }

  /**
   * Handles HTTP errors from the backend.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Unauthorized: Invalid credentials or session expired.';
      } else if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = `Backend error: ${error.error.message}`;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Sends a login request with user credentials to the backend.
   * @param credentials The LoginRequest object containing email and password.
   * @param rememberMe Whether to persist the session across browser restarts.
   */
  login(credentials: LoginRequest, rememberMe = true): Observable<AuthResponse> {
    // Set storage mode BEFORE writing any auth data
    this.setRememberMe(rememberMe);

    return this.http.post<AuthResponse>(`${this.apiUrl}${ApiEndpoints.AUTH.LOGIN}`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
      }),
      switchMap(response =>
        this.getCurrentUser().pipe(
          tap(user => this.setUser(user)),
          switchMap(() => [response])
        )
      ),
      tap(() => this.connectWebSocket()),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Sends a registration request to the backend.
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}${ApiEndpoints.AUTH.REGISTER}`, request).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Fetches the current user's details from the backend.
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
   * Clears all authentication-related data from signals and both storages.
   */
  private clearAuthData(): void {
    this.clearToken();
    this.setUser(null);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }

  /**
   * Lazily connect WebSocket after authentication.
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
    } catch {
      // Silently handle — WS may not have been connected
    }
  }
}
