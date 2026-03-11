import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { User, UserProfile, PasswordChangeDTO, ChangeEmailDTO, DisableAccountDTO, DeleteAccountDTO } from '../../models/auth.model';
import { ApiEndpoints } from '../../constants/api-endpoints';
@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {
  private readonly apiUrl = environment.apiUrl;
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
    return this.http.get<User>(`${this.apiUrl}${ApiEndpoints.USERS.ME}`)
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
    return this.http.put<User>(`${this.apiUrl}${ApiEndpoints.USERS.ME}`, profile)
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
    return this.http.post(`${this.apiUrl}${ApiEndpoints.USERS.CHANGE_PASSWORD}`, data)
      .pipe(
        tap(() => {
          this.saving.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to change password.');
          this.saving.set(false);
          return this.handleError(err);
        })
      );
  }

  changeEmail(data: ChangeEmailDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}${ApiEndpoints.USERS.CHANGE_EMAIL}`, data)
      .pipe(
        tap(user => {
          this.currentUser.set(user);
        }),
        catchError(err => this.handleError(err))
      );
  }

  disableAccount(data: DisableAccountDTO): Observable<unknown> {
    return this.http.post(`${this.apiUrl}${ApiEndpoints.USERS.DISABLE_ACCOUNT}`, data)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  enableAccount(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}${ApiEndpoints.USERS.ENABLE_ACCOUNT}`, {})
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  deleteAccount(data: DeleteAccountDTO): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}${ApiEndpoints.USERS.ME}`, { body: data })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
