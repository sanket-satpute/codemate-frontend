import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  constructor() {
    super();
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Logs in a user.
   * @param credentials The login credentials.
   * @returns An observable with the login response.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // Store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('token', response.accessToken);
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registers a new user.
   * @param userInfo The user information for registration.
   * @returns An observable with the registration response.
   */
  register(userInfo: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userInfo)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Logs out the current user.
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  /**
   * Checks if the user has a specific role.
   * @param role The role to check.
   * @returns True if the user has the role, false otherwise.
   */
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return !!user && user.roles.includes(role);
  }
}
