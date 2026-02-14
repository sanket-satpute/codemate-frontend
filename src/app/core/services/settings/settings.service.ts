import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { User, UserProfile, PasswordChangeDTO } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    super();
  }

  getCurrentUser(): Observable<User> {
    this.loading.set(true);
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getHeaders() })
      .pipe(
        tap(user => {
          this.currentUser.set(user);
          this.loading.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to load user profile.');
          this.loading.set(false);
          return this.handleError(err);
        })
      );
  }

  updateProfile(profile: UserProfile): Observable<User> {
    this.saving.set(true);
    return this.http.put<User>(`${this.apiUrl}/me`, profile, { headers: this.getHeaders() })
      .pipe(
        tap(user => {
          this.currentUser.set(user);
          this.saving.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to update profile.');
          this.saving.set(false);
          return this.handleError(err);
        })
      );
  }

  changePassword(data: PasswordChangeDTO): Observable<unknown> {
    this.saving.set(true);
    return this.http.post(`${this.apiUrl}/change-password`, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.saving.set(false);
          // Optionally clear password fields or show success message
        }),
        catchError(err => {
          this.error.set('Failed to change password.');
          this.saving.set(false);
          return this.handleError(err);
        })
      );
  }
}
