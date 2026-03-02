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
   * Retrieves dashboard data for the authenticated user.
   * Backend: GET /api/dashboard (userId extracted from JWT)
   * @returns An observable of the dashboard data.
   */
  getDashboardData(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
}
