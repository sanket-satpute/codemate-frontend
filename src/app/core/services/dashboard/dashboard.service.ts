import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../base.service';
import { Dashboard } from '../../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  /**
   * Fetches aggregated dashboard data for a specific user.
   * This aligns with the documented `GET /api/dashboard?userId={userId}` endpoint.
   * @param userId The ID of the user.
   * @returns An observable of the Dashboard object.
   */
  getDashboardData(userId: string): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}?userId=${userId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}
